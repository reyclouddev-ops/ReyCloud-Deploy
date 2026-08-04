require("dotenv").config();
require("./config");

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const os = require("os");

const app = express();

const PORT = process.env.PORT || 3000;
const VERCEL_API = "https://api.vercel.com";

const token = String(process.env.VERCEL_TOKEN || "").trim();
const domain = String(global.domain || "").trim();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

function vercelHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanProjectName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidProjectName(name) {
  return /^[a-z0-9][a-z0-9-]{1,62}$/.test(name);
}

function getExtension(filename) {
  return path.extname(filename || "").toLowerCase();
}

async function getVercelUser(token) {
  const response = await axios.get(
    `${VERCEL_API}/v2/user`,
    {
      headers: vercelHeaders(token),
      timeout: 30000
    }
  );

  return response.data;
}

async function createProject(token, projectName) {
  try {
    const response = await axios.post(
      `${VERCEL_API}/v9/projects`,
      {
        name: projectName
      },
      {
        headers: vercelHeaders(token),
        timeout: 30000
      }
    );

    return response.data;
  } catch (error) {
    const status = error.response?.status;

    if (status === 409) {
      const response = await axios.get(
        `${VERCEL_API}/v9/projects/${encodeURIComponent(projectName)}`,
        {
          headers: vercelHeaders(token),
          timeout: 30000
        }
      );

      return response.data;
    }

    throw error;
  }
}

function collectFiles(directory, base = directory) {
  const result = [];

  const entries = fs.readdirSync(
    directory,
    {
      withFileTypes: true
    }
  );

  for (const entry of entries) {
    const fullPath = path.join(
      directory,
      entry.name
    );

    if (entry.isDirectory()) {
      result.push(
        ...collectFiles(
          fullPath,
          base
        )
      );
    } else {
      const relative = path
        .relative(base, fullPath)
        .replace(/\\/g, "/");

      result.push({
        filePath: fullPath,
        fileName: relative
      });
    }
  }

  return result;
}

async function deployFiles(
  token,
  projectName,
  directory
) {
  const files = collectFiles(directory);

  if (!files.length) {
    throw new Error(
      "Tidak ada file untuk dideploy."
    );
  }

  const payloadFiles = [];

  for (const file of files) {
    const buffer = fs.readFileSync(
      file.filePath
    );

    payloadFiles.push({
      file: file.fileName,
      data: buffer.toString("base64"),
      encoding: "base64"
    });
  }

  const response = await axios.post(
    `${VERCEL_API}/v13/deployments`,
    {
      name: projectName,
      project: projectName,
      files: payloadFiles,
      projectSettings: {
        framework: null
      }
    },
    {
      headers: vercelHeaders(token),
      timeout: 120000,
      maxContentLength: 50 * 1024 * 1024,
      maxBodyLength: 50 * 1024 * 1024
    }
  );

  return response.data;
}

async function addCustomDomain(
  token,
  projectName,
  customDomain
) {
  try {
    const response = await axios.post(
      `${VERCEL_API}/v10/projects/${encodeURIComponent(projectName)}/domains`,
      {
        name: customDomain
      },
      {
        headers: vercelHeaders(token),
        timeout: 30000
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (
      status === 400 ||
      status === 409
    ) {
      const message = JSON.stringify(
        data || ""
      ).toLowerCase();

      if (
        message.includes("already") ||
        message.includes("domain")
      ) {
        return {
          success: true,
          alreadyExists: true,
          data
        };
      }
    }

    return {
      success: false,
      error:
        data?.error?.message ||
        error.message
    };
  }
}

async function getDeployment(
  token,
  deploymentId
) {
  const response = await axios.get(
    `${VERCEL_API}/v13/deployments/${encodeURIComponent(deploymentId)}`,
    {
      headers: vercelHeaders(token),
      timeout: 30000
    }
  );

  return response.data;
}

async function waitDeployment(
  token,
  deploymentId
) {
  const maxAttempts = 60;

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {
    const deployment =
      await getDeployment(
        token,
        deploymentId
      );

    const state =
      deployment.readyState;

    if (state === "READY") {
      return deployment;
    }

    if (
      state === "ERROR" ||
      state === "CANCELED"
    ) {
      throw new Error(
        `Deployment ${state.toLowerCase()}.`
      );
    }

    await sleep(2000);
  }

  throw new Error(
    "Deployment terlalu lama diproses."
  );
}

function prepareProject(
  file,
  workDir
) {
  const filename =
    file.originalname;

  const extension =
    getExtension(filename);

  const sourcePath =
    path.join(
      workDir,
      filename
    );

  fs.writeFileSync(
    sourcePath,
    file.buffer
  );

  const siteDir =
    path.join(
      workDir,
      "site"
    );

  fs.mkdirSync(
    siteDir,
    {
      recursive: true
    }
  );

  if (extension === ".zip") {
    const zip =
      new AdmZip(sourcePath);

    zip.extractAllTo(
      siteDir,
      true
    );

    return siteDir;
  }

  if (
    extension === ".html" ||
    extension === ".htm"
  ) {
    fs.copyFileSync(
      sourcePath,
      path.join(
        siteDir,
        "index.html"
      )
    );

    return siteDir;
  }

  throw new Error(
    "Format file tidak didukung. Gunakan ZIP atau HTML."
  );
}

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);

app.post(
  "/api/deploy",
  upload.single("project"),
  async (req, res) => {
    let workDir = null;

    try {
      if (!token) {
        throw new Error(
          "VERCEL_TOKEN belum dikonfigurasi."
        );
      }

      if (!domain) {
        throw new Error(
          "Domain belum dikonfigurasi."
        );
      }

      const projectName =
        cleanProjectName(
          req.body.subdomain
        );

      if (!projectName) {
        throw new Error(
          "Nama project wajib diisi."
        );
      }

      if (
        !isValidProjectName(
          projectName
        )
      ) {
        throw new Error(
          "Nama project tidak valid."
        );
      }

      if (!req.file) {
        throw new Error(
          "Project belum dipilih."
        );
      }

      const extension =
        getExtension(
          req.file.originalname
        );

      if (
        extension !== ".zip" &&
        extension !== ".html" &&
        extension !== ".htm"
      ) {
        throw new Error(
          "Gunakan file ZIP, HTML atau HTM."
        );
      }

      workDir =
        fs.mkdtempSync(
          path.join(
            os.tmpdir(),
            "reydeploy-"
          )
        );

      const siteDir =
        prepareProject(
          req.file,
          workDir
        );

      const siteFiles =
        collectFiles(siteDir);

      if (!siteFiles.length) {
        throw new Error(
          "Project tidak mempunyai file."
        );
      }

      const vercelUser =
        await getVercelUser(
          token
        );

      await createProject(
        token,
        projectName
      );

      const deployment =
        await deployFiles(
          token,
          projectName,
          siteDir
        );

      const ready =
        await waitDeployment(
          token,
          deployment.id
        );

      const customDomain =
        `${projectName}.${domain}`;

      const domainResult =
        await addCustomDomain(
          token,
          projectName,
          customDomain
        );

      const vercelUrl =
        ready.url
          ? `https://${ready.url}`
          : `https://${projectName}.vercel.app`;

      return res.json({
        status: true,
        message:
          "Deployment berhasil.",
        project: projectName,
        account:
          vercelUser?.user?.username ||
          vercelUser?.user?.email ||
          "-",
        file:
          req.file.originalname,
        files:
          siteFiles.length,
        deploymentId:
          deployment.id,
        vercelUrl,
        customDomain:
          `https://${customDomain}`,
        domainSuccess:
          domainResult.success,
        domainError:
          domainResult.success
            ? null
            : domainResult.error
      });
    } catch (error) {
      console.error(
        "[REYCLOUD DEPLOY]",
        error.response?.data ||
        error
      );

      return res.status(500).json({
        status: false,
        message:
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          error.message ||
          "Deployment gagal."
      });
    } finally {
      if (
        workDir &&
        fs.existsSync(workDir)
      ) {
        try {
          fs.rmSync(
            workDir,
            {
              recursive: true,
              force: true
            }
          );
        } catch {}
      }
    }
  }
);

app.listen(
  PORT,
  () => {
    console.log(
      `ReyCloud Deploy berjalan di port ${PORT}`
    );
  }
);
