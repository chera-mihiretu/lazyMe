# Real-Time Blog Tag Extractor

## Description

This project is a real-time tag extractor for blog posts. It uses Natural Language Processing (NLP) to analyze the title and body of a blog post and suggests relevant tags. The service is built with FastAPI and uses KeyBERT for keyword extraction, along with other NLP libraries.

## Features

-   **Real-Time Tagging:** Instantly generate tags for blog content.
-   **API-Based:** Easy to integrate with other services through a simple REST API.
-   **NLP-Powered:** Utilizes state-of-the-art NLP models for accurate tag extraction.

## Technologies Used

-   **Python**
-   **FastAPI:** For building the web server.
-   **Uvicorn:** As the ASGI server.
-   **KeyBERT:** For keyword and keyphrase extraction.
-   **Sentence-Transformers:** Provides the underlying sentence embedding models for KeyBERT.
-   **spaCy:** For NLP pre-processing.
-   **NLTK:** For additional NLP tasks.

## Setup and Installation

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/ayanasamuel8/Iknow.git
cd Iknow/text-extractor
```

### 2. Create and Activate a Virtual Environment

It is highly recommended to use a virtual environment to manage project dependencies.

**On macOS/Linux:**

```bash
python3 -m venv virtual
source virtual/bin/activate
```

**On Windows:**

```bash
python -m venv virtual
.\virtual\Scripts\activate
```

### 3. Install Dependencies

Install the required Python packages using the `requirements.txt` file.

```bash
pip install -r requirements.txt

python -m spacy download en_core_web_sm
```

### 4. Download NLP Models

The first time you run the application, some NLP models will be downloaded. This might take a few minutes. Ensure you have a stable internet connection.

## Running the Application

To start the FastAPI server, run the following command from the `Ml/text-extractor` directory:

```bash
uvicorn service.app:app --reload
```

The server will be running at `http://127.0.0.1:8000`.

## API Endpoints

### `POST /extract-tags`

This endpoint receives a blog post's title and body and returns a list of suggested tags.

-   **URL:** `/extract-tags`
-   **Method:** `POST`
-   **Request Body:**

    ```json
    {
        "title": "string",
        "body": "string"
    }
    ```

-   **Success Response:**

    -   **Code:** 200 OK
    -   **Content:**

        ```json
        {
            "tags": ["tag1", "tag2", "tag3"]
        }
        ```

### `GET /`

A simple endpoint to check if the service is running.

-   **URL:** `/`
-   **Method:** `GET`
-   **Success Response:**

    -   **Code:** 200 OK
    -   **Content:**

        ```json
        {
            "message": "Welcome to the Real-Time Blog Tag Extractor API"
        }
        ```

## Usage

You can use a tool like `curl` or any API client (like Postman or Insomnia) to interact with the API.

Here's an example using `curl`:

```bash
curl -X POST "http://127.0.0.1:8000/extract-tags" \
-H "Content-Type: application/json" \
-d '{
    "title": "Introduction to Machine Learning",
    "body": "Machine learning is a field of computer science that uses statistical techniques to give computer systems the ability to learn from data, without being explicitly programmed."
}'
```

This will return a JSON response with the extracted tags.

## Troubleshooting

### `ModuleNotFoundError: No module named 'src'`

If you encounter an error like `ModuleNotFoundError: No module named 'src'`, it means Python cannot find the source code directory. You can fix this by setting the `PYTHONPATH` environment variable to the root of the `text-extractor` directory.

**On Windows (PowerShell):**
```powershell
$env:PYTHONPATH="."
```

**On macOS/Linux:**
```bash
export PYTHONPATH=.
```

After setting the environment variable in your terminal, you can run the application:
```bash
uvicorn service.app:app --reload
```
