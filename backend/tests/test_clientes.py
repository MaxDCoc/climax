def _crear_cliente(client, **overrides):
    payload = {
        "nombre": "Juan Pérez",
        "direccion": "Calle Falsa 123",
        "telefono": "1122334455",
        "observaciones": None,
    }
    payload.update(overrides)
    return client.post("/api/v1/clientes", json=payload)


def test_crear_cliente(client):
    response = _crear_cliente(client)
    assert response.status_code == 201
    data = response.json()
    assert data["nombre"] == "Juan Pérez"
    assert "id" in data


def test_crear_cliente_sin_campos_requeridos_devuelve_422(client):
    response = client.post("/api/v1/clientes", json={"nombre": "Juan"})
    assert response.status_code == 422


def test_crear_cliente_sin_direccion_es_valido(client):
    response = _crear_cliente(client, direccion=None)
    assert response.status_code == 201
    assert response.json()["direccion"] is None


def test_listar_clientes(client):
    _crear_cliente(client)
    _crear_cliente(client, nombre="Ana Gómez")

    response = client.get("/api/v1/clientes")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_obtener_cliente(client):
    creado = _crear_cliente(client).json()

    response = client.get(f"/api/v1/clientes/{creado['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == creado["id"]


def test_obtener_cliente_inexistente_devuelve_404(client):
    response = client.get("/api/v1/clientes/999")
    assert response.status_code == 404


def test_actualizar_cliente(client):
    creado = _crear_cliente(client).json()

    response = client.put(
        f"/api/v1/clientes/{creado['id']}",
        json={
            "nombre": "Juan Actualizado",
            "direccion": "Nueva Dirección 456",
            "telefono": "5544332211",
            "observaciones": "cliente frecuente",
        },
    )
    assert response.status_code == 200
    assert response.json()["nombre"] == "Juan Actualizado"


def test_actualizar_cliente_inexistente_devuelve_404(client):
    response = client.put(
        "/api/v1/clientes/999",
        json={
            "nombre": "X",
            "direccion": "X",
            "telefono": "X",
        },
    )
    assert response.status_code == 404


def test_eliminar_cliente(client):
    creado = _crear_cliente(client).json()

    response = client.delete(f"/api/v1/clientes/{creado['id']}")
    assert response.status_code == 204

    response = client.get(f"/api/v1/clientes/{creado['id']}")
    assert response.status_code == 404


def test_eliminar_cliente_inexistente_devuelve_404(client):
    response = client.delete("/api/v1/clientes/999")
    assert response.status_code == 404
