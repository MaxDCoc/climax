def _crear_cliente(client):
    return client.post(
        "/api/v1/clientes",
        json={
            "nombre": "Juan Pérez",
            "direccion": "Calle Falsa 123",
            "telefono": "1122334455",
        },
    ).json()


def _crear_equipo(client, cliente_id):
    return client.post(
        f"/api/v1/clientes/{cliente_id}/equipos",
        json={
            "tipo": "aire",
            "marca": "Surrey",
            "frigorias": 3000,
        },
    ).json()


def _crear_servicio(client, equipo_id, **overrides):
    payload = {
        "tipo_servicio": "INSTALACION",
        "fecha_serv": "2026-01-15",
        "observaciones": None,
    }
    payload.update(overrides)
    return client.post(f"/api/v1/equipos/{equipo_id}/servicios", json=payload)


def test_crear_servicio_calcula_fecha_prox_serv_instalacion(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo(client, cliente["id"])

    response = _crear_servicio(client, equipo["id"], tipo_servicio="INSTALACION")
    assert response.status_code == 201
    data = response.json()
    assert data["fecha_prox_serv"] == "2027-01-15"


def test_crear_servicio_calcula_fecha_prox_serv_service(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo(client, cliente["id"])

    response = _crear_servicio(client, equipo["id"], tipo_servicio="SERVICE")
    assert response.json()["fecha_prox_serv"] == "2027-07-15"


def test_crear_servicio_calcula_fecha_prox_serv_reparacion(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo(client, cliente["id"])

    response = _crear_servicio(client, equipo["id"], tipo_servicio="REPARACION")
    assert response.json()["fecha_prox_serv"] == "2026-04-15"


def test_crear_servicio_para_equipo_inexistente_devuelve_404(client):
    response = _crear_servicio(client, 999)
    assert response.status_code == 404


def test_listar_servicios_de_equipo(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo(client, cliente["id"])
    _crear_servicio(client, equipo["id"])

    response = client.get(f"/api/v1/equipos/{equipo['id']}/servicios")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_obtener_servicio(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo(client, cliente["id"])
    servicio = _crear_servicio(client, equipo["id"]).json()

    response = client.get(f"/api/v1/servicios/{servicio['id']}")
    assert response.status_code == 200


def test_obtener_servicio_inexistente_devuelve_404(client):
    response = client.get("/api/v1/servicios/999")
    assert response.status_code == 404


def test_actualizar_servicio_recalcula_fecha_prox_serv(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo(client, cliente["id"])
    servicio = _crear_servicio(client, equipo["id"], tipo_servicio="INSTALACION").json()

    response = client.put(
        f"/api/v1/servicios/{servicio['id']}",
        json={
            "tipo_servicio": "REPARACION",
            "fecha_serv": "2026-02-01",
            "observaciones": "cambio de tipo",
        },
    )
    assert response.status_code == 200
    assert response.json()["fecha_prox_serv"] == "2026-05-01"


def test_actualizar_servicio_inexistente_devuelve_404(client):
    response = client.put(
        "/api/v1/servicios/999",
        json={"tipo_servicio": "SERVICE", "fecha_serv": "2026-01-01"},
    )
    assert response.status_code == 404


def test_eliminar_servicio(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo(client, cliente["id"])
    servicio = _crear_servicio(client, equipo["id"]).json()

    response = client.delete(f"/api/v1/servicios/{servicio['id']}")
    assert response.status_code == 204

    response = client.get(f"/api/v1/servicios/{servicio['id']}")
    assert response.status_code == 404


def test_eliminar_servicio_inexistente_devuelve_404(client):
    response = client.delete("/api/v1/servicios/999")
    assert response.status_code == 404
