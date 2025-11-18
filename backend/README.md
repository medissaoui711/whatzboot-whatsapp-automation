# WhatzBoot Backend

This directory contains the Python/FastAPI backend for the WhatzBoot application. It provides a secure and scalable API for all frontend operations, including authentication, data management, and business logic.

## Project Structure

- **/app**: Main application folder.
- **/app/main.py**: FastAPI app entry point.
- **/app/api**: API endpoint definitions (routes).
- **/app/core**: Core settings, security, and configurations.
- **/app/models**: Pydantic models for data structures.
- **/app/schemas**: API data schemas (request/response validation).
- **/app/database**: Database session and connection management.
- **/app/utils**: Utility functions and helpers.
- **/tests**: Unit and integration tests.
- **/scripts**: Helper scripts for tasks like database seeding.

## Setup

1.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set up environment variables:**
    - Copy `.env.example` to a new file named `.env`.
    - Fill in the required values, such as `DATABASE_URL` and a `SECRET_KEY` for JWT. You can generate a secret key using:
      ```bash
      openssl rand -hex 32
      ```

## Running the Server

Use Uvicorn to run the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000` and the documentation at `http://127.0.0.1:8000/docs`.
