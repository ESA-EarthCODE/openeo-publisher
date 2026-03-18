# EarthCODE - openEO Publisher

The **EarthCODE - openEO Publisher** is a Proof of Concept (PoC) developed under the EarthCODE project. Its primary goal
is to provide an intuitive user interface for publishing results from an openEO-based platform into the EarthCODE
catalogue.

This application is built using **React** and **Next.js**.

## Getting Started

1. **Install Prerequisites**  
   Run the following command to install the required dependencies:
   ```bash
   npm install
   ```

2. **Start the Application**  
   Launch the development server using:
   ```bash
   npm run dev
   ```


## Configure Your Environment

To ensure proper functionality, create a `.env` file in the root directory with the following keys and values:

| **Key**                       | **Value**                                                                                     |  
|-------------------------------|-----------------------------------------------------------------------------------------------|  
| `NEXT_PUBLIC_GITHUB_TOKEN`    | Your GitHub token for creating pull requests and publishing results to the GitHub repository. |  
| `NEXT_PUBLIC_GITHUB_OWNER`    | The owner (organization or user) of the EarthCODE Catalogue GitHub repository.                |  
| `NEXT_PUBLIC_GITHUB_REPO`     | The name of the EarthCODE Catalogue GitHub repository.                                        |  
| `NEXT_PUBLIC_OPENEO_BACKENDS` | A comma-separated list of openEO backend endpoints to support.                                |  
| `S3_REGION`                   | S3 region for the bucket (defaults to `us-east-1` when omitted).                             |  
| `S3_ACCESS_KEY_ID`            | Access key ID used for S3 uploads.                                                            |  
| `S3_SECRET_ACCESS_KEY`        | Secret access key used for S3 uploads.                                                        |  
| `S3_ENDPOINT`                 | Optional custom S3 endpoint (for S3-compatible storage).                                      |  
| `S3_PUBLIC_BASE_URL`          | Optional public HTTP base URL for uploaded objects (recommended).                             |  
| `S3_PUBLIC_URL_STYLE`         | Optional URL style when `S3_ENDPOINT` is used: `path` (default) or `virtual-host`.           |  

Example `.env` file:

```env
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here  
NEXT_PUBLIC_GITHUB_OWNER=earthcode_org  
NEXT_PUBLIC_GITHUB_REPO=earthcode-catalogue  
NEXT_PUBLIC_OPENEO_BACKENDS=https://backend1.openeo.org/openeo,https://backend2.openeo.org/openeo
S3_BUCKET=earthcode-workflows
S3_REGION=eu-central-1
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_ENDPOINT=https://s3.waw3-1.cloudferro.com
S3_PUBLIC_BASE_URL=https://cdn.your-provider.example/earthcode-workflows
S3_PUBLIC_URL_STYLE=path
```  

