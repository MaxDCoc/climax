def test_endpoint_protegido_sin_token_devuelve_401(unauthenticated_client):
    response = unauthenticated_client.get("/api/v1/clientes")
    assert response.status_code == 401


def test_endpoint_protegido_con_token_invalido_devuelve_401(unauthenticated_client):
    response = unauthenticated_client.get(
        "/api/v1/clientes",
        headers={"Authorization": "Bearer token-invalido"},
    )
    assert response.status_code == 401
