from datetime import date, timedelta


def _crear_cliente(client, telefono="1122334455"):
    return client.post(
        "/api/v1/clientes",
        json={
            "nombre": "Juan Pérez",
            "direccion": "Calle Falsa 123",
            "telefono": telefono,
        },
    ).json()


def _crear_equipo(client, cliente_id):
    return client.post(
        f"/api/v1/clientes/{cliente_id}/equipos",
        json={"tipo": "aire", "marca": "Surrey", "frigorias": 3000},
    ).json()


def _crear_servicio(client, equipo_id, fecha_serv, tipo_servicio="REPARACION"):
    return client.post(
        f"/api/v1/equipos/{equipo_id}/servicios",
        json={
            "tipo_servicio": tipo_servicio,
            "fecha_serv": fecha_serv.isoformat(),
        },
    ).json()


def test_oportunidades_solo_considera_el_servicio_mas_reciente_por_equipo(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo(client, cliente["id"])

    hoy = date.today()
    # Servicio viejo: su fecha_prox_serv ya venció hace mucho (calificaría si el bug
    # de "cualquier fila histórica" siguiera presente).
    servicio_viejo = _crear_servicio(
        client, equipo["id"], hoy - timedelta(days=1000), tipo_servicio="REPARACION"
    )
    # Servicio más reciente para el mismo equipo, con próximo service lejos en el futuro.
    _crear_servicio(client, equipo["id"], hoy, tipo_servicio="REPARACION")

    response = client.get("/api/v1/servicios/oportunidades", params={"dias": 30})
    assert response.status_code == 200

    ids_devueltos = [o["servicio_id"] for o in response.json()]
    assert servicio_viejo["id"] not in ids_devueltos
    assert len(response.json()) == 0  # el más reciente vence en ~3 meses, fuera de 30 días


def test_oportunidades_incluye_el_servicio_mas_reciente_dentro_del_rango(client):
    cliente = _crear_cliente(client)
    equipo = _crear_equipo(client, cliente["id"])

    hoy = date.today()
    servicio_reciente = _crear_servicio(client, equipo["id"], hoy, tipo_servicio="REPARACION")

    # REPARACION => próximo servicio a los 3 meses (~90 días), cubierto por un rango amplio.
    response = client.get("/api/v1/servicios/oportunidades", params={"dias": 120})
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    assert data[0]["servicio_id"] == servicio_reciente["id"]
    assert data[0]["cliente"]["nombre"] == "Juan Pérez"
    assert data[0]["equipo"]["marca"] == "Surrey"


def test_oportunidades_no_incluye_equipos_sin_fecha_prox_vencida(client):
    cliente = _crear_cliente(client, telefono="999")
    equipo = _crear_equipo(client, cliente["id"])
    _crear_servicio(client, equipo["id"], date.today(), tipo_servicio="INSTALACION")

    response = client.get("/api/v1/servicios/oportunidades", params={"dias": 30})
    assert response.status_code == 200
    assert response.json() == []
