def _crear_cliente(client):
    response = client.post(
        "/api/v1/clientes",
        json={
            "nombre": "Juan Pérez",
            "direccion": "Calle Falsa 123",
            "telefono": "1122334455",
        },
    )
    return response.json()


def _crear_equipo_aire(client, cliente_id, **overrides):
    payload = {
        "tipo": "aire",
        "marca": "Surrey",
        "modelo": "X100",
        "frigorias": 3000,
        "tipo_aire": "split",
        "fecha_instalacion": "2025-01-10",
        "fecha_ultimo_servi": None,
        "observaciones": None,
    }
    payload.update(overrides)
    return client.post(f"/api/v1/clientes/{cliente_id}/equipos", json=payload)


def test_crear_equipo(client):
    cliente = _crear_cliente(client)

    response = _crear_equipo_aire(client, cliente["id"])
    assert response.status_code == 201
    data = response.json()
    assert data["tipo"] == "aire"
    assert data["frigorias"] == 3000
    assert data["cliente_id"] == cliente["id"]


def test_crear_equipo_para_cliente_inexistente_devuelve_404(client):
    response = _crear_equipo_aire(client, 999)
    assert response.status_code == 404


def test_listar_equipos_de_cliente(client):
    cliente = _crear_cliente(client)
    _crear_equipo_aire(client, cliente["id"])

    response = client.get(f"/api/v1/clientes/{cliente['id']}/equipos")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_listar_equipos_de_cliente_inexistente_devuelve_404(client):
    response = client.get("/api/v1/clientes/999/equipos")
    assert response.status_code == 404


def test_obtener_equipo(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo_aire(client, cliente["id"]).json()

    response = client.get(f"/api/v1/equipos/{equipo['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == equipo["id"]


def test_obtener_equipo_inexistente_devuelve_404(client):
    response = client.get("/api/v1/equipos/999")
    assert response.status_code == 404


def test_actualizar_equipo(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo_aire(client, cliente["id"]).json()

    response = client.put(
        f"/api/v1/equipos/{equipo['id']}",
        json={"marca": "NuevaMarca"},
    )
    assert response.status_code == 200
    assert response.json()["marca"] == "NuevaMarca"


def test_actualizar_equipo_inexistente_devuelve_404(client):
    response = client.put("/api/v1/equipos/999", json={"marca": "X"})
    assert response.status_code == 404


def test_eliminar_equipo(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo_aire(client, cliente["id"]).json()

    response = client.delete(f"/api/v1/equipos/{equipo['id']}")
    assert response.status_code == 204

    response = client.get(f"/api/v1/equipos/{equipo['id']}")
    assert response.status_code == 404


def test_eliminar_equipo_inexistente_devuelve_404(client):
    response = client.delete("/api/v1/equipos/999")
    assert response.status_code == 404
