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

Example `.env` file:

```env
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here  
NEXT_PUBLIC_GITHUB_OWNER=earthcode_org  
NEXT_PUBLIC_GITHUB_REPO=earthcode-catalogue  
NEXT_PUBLIC_OPENEO_BACKENDS=https://backend1.openeo.org/openeo,https://backend2.openeo.org/openeo
```  

