"""
Suite de tests para verificar el flujo de autenticación JWT con rotation.
Ejecutar: python test_auth.py
"""
import requests
import time
import sys

B = "http://localhost:8080/api"
ts = int(time.time())
email = f"suite{ts}@test.com"
password = "TestPass123!"

PASS = 0
FAIL = 0

def check(label, got, exp):
    global PASS, FAIL
    if str(got) == str(exp):
        print(f"[OK]  {label} => {got}")
        PASS += 1
    else:
        print(f"[FAIL] {label} => esperado={exp} obtenido={got}")
        FAIL += 1

def post(path, json=None, headers=None, cookies=None):
    return requests.post(f"{B}{path}", json=json, headers=headers or {}, cookies=cookies or {}, allow_redirects=False)

def get(path, headers=None, cookies=None):
    return requests.get(f"{B}{path}", headers=headers or {}, cookies=cookies or {}, allow_redirects=False)

print("=== TEST SUITE AUTH ===")
print(f"Email: {email}")
print()

# TEST 1: REGISTER
r1 = post("/auth/register", json={"nombre": "TestUser", "apellidos": "AuthTest", "email": email, "password": password})
check("REGISTER", r1.status_code, 201)
ACC = r1.json().get("accessToken", "") if r1.status_code == 201 else ""
REF = r1.cookies.get("refreshToken", "")
if not ACC: print(f"  WARN: No accessToken. Body={r1.text[:200]}")
if not REF: print(f"  WARN: No refreshToken cookie")

# TEST 2: LOGIN
r2 = post("/auth/login", json={"email": email, "password": password})
check("LOGIN", r2.status_code, 200)
ACC = r2.json().get("accessToken", "") if r2.status_code == 200 else ACC
REF = r2.cookies.get("refreshToken", REF)
if not ACC: print("  WARN: No accessToken"); sys.exit(1)
if not REF: print("  WARN: No refreshToken cookie"); sys.exit(1)

# TEST 3: TOKEN VALIDO
r3 = get("/usuario", headers={"Authorization": f"Bearer {ACC}"})
check("TOKEN VALIDO /usuario => 200", r3.status_code, 200)

# TEST 4: TOKEN INVALIDO
r4 = get("/usuario", headers={"Authorization": "Bearer fake.jwt.token"})
check("TOKEN INVALIDO => 401", r4.status_code, 401)

# TEST 5: REFRESH ROTATION
old_acc = ACC; old_ref = REF
r5 = post("/auth/refresh", headers={"X-Device-Id": "testdevice1"}, cookies={"refreshToken": REF})
check("REFRESH => 200", r5.status_code, 200)
if r5.status_code == 200:
    new_acc = r5.json().get("accessToken", "")
    new_ref = r5.cookies.get("refreshToken", "")
    if new_acc and new_acc != old_acc:
        print(f"[OK]  REFRESH access rotado (len={len(new_acc)})")
        PASS += 1
    else:
        print(f"[FAIL] REFRESH access NO rotado (old={old_acc[:30]}... new={new_acc[:30]}...)")
        FAIL += 1
    if new_ref and new_ref != old_ref:
        print(f"[OK]  REFRESH cookie rotada (len={len(new_ref)})")
        PASS += 1
    else:
        print(f"[FAIL] REFRESH cookie NO rotada")
        FAIL += 1
    ACC = new_acc; REF = new_ref
else:
    print(f"  Body: {r5.text[:200]}")
    FAIL += 2  # rotation checks

# TEST 6: REUSE DETECTION (token viejo)
r6 = post("/auth/refresh", headers={"X-Device-Id": "testdevice1"}, cookies={"refreshToken": old_ref})
check("REUSE DETECT (token viejo) => 401", r6.status_code, 401)

# TEST 7: FAMILIA REVOCADA (token actual tras reuse)
r7 = post("/auth/refresh", headers={"X-Device-Id": "testdevice1"}, cookies={"refreshToken": REF})
check("FAMILIA REVOCADA => 401", r7.status_code, 401)

# TEST 8: LOGOUT + BLACKLIST
r8l = post("/auth/login", json={"email": email, "password": password})
acc8 = r8l.json().get("accessToken", "")
ref8 = r8l.cookies.get("refreshToken", "")
r8lo = post("/auth/logout", headers={"Authorization": f"Bearer {acc8}"}, cookies={"refreshToken": ref8})
check("LOGOUT => 204", r8lo.status_code, 204)
r8bl = get("/usuario", headers={"Authorization": f"Bearer {acc8}"})
check("BLACKLIST access token => 401", r8bl.status_code, 401)
r8rf = post("/auth/refresh", headers={"X-Device-Id": "testdevice1"}, cookies={"refreshToken": ref8})
check("BLACKLIST refresh token => 401", r8rf.status_code, 401)

# TEST 9: RBAC
r9l = post("/auth/login", json={"email": email, "password": password})
acc9 = r9l.json().get("accessToken", "")
r9 = get("/usuarios", headers={"Authorization": f"Bearer {acc9}"})
check("RBAC user->admin => 403", r9.status_code, 403)

# TEST 10: SIN TOKEN
r10 = get("/usuario")
check("SIN TOKEN => 401", r10.status_code, 401)

# RESUMEN
print()
print("================================")
print(f"RESULTADOS: {PASS} OK | {FAIL} FAIL")
if FAIL == 0:
    print("TODAS LAS PRUEBAS PASARON!")
else:
    print(f"HAY {FAIL} FALLOS")
print("================================")
