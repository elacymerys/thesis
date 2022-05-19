from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_hello_world():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_hello_name():
    response = client.get("/hello/student")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello student"}
