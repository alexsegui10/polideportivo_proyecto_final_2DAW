-- Script para actualizar las imágenes de las pistas con las del diseño de ejemplo
-- Ejecutar este script en PostgreSQL

-- Pista Pádel 1 - Indoor con cristal panorámico (azul)
UPDATE pistas 
SET imagen = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmpNUk_3eRkn9RhfawkN2wNPsdn-tWbKffivmprrvkO6YkfEgvauqydzRccHnZcN6YDT4LEP7_TP-9Ircy8s-biy93hPI669AW2_lMk16IGn_Rzdkbf_aYfDWDqANVUae1vq8B4jv5NkwqvYBcrXQ_2WKeG_zKPqlovvNafW9nG7En8vl0OsWrprJCknA8i8_SmGfvxIcGkhMgBuoQlwQedJAFn6qP0Q4ZnBOw_5AsYZAgojrONhMkQGtzw68-RMV3Utkso3AjaYQ'
WHERE id = 1;

-- Pista Pádel 2 - Outdoor con muro de concreto
UPDATE pistas 
SET imagen = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXeZnfcxyno7NRjbLWEVoFWBonUeIMRkImAMw0nWPN8zNV9ORRDqLW3VqsoQaEyZ-GQ3MNkdNHnP_W-SzCAfVa_mrxFWp0I84cO3zJ-3kCjDzLhqAuEsLkGwa5jVjJlQG4YiZxkrM8QaYRW2aDXYc9WoNoXgGnH2iLMzbik2WSEmOltry3mP6iY7APJt6134GpuLyv9ZXBnZDjQK6ml3KF2lLVPkt7yqsBj23hXgeGXIoi-Uhdv_wEMpvP-L7krMu5ykhmgcGOh3A'
WHERE id = 2;

-- Pista Tenis 1 - Indoor estándar con cristal
UPDATE pistas 
SET imagen = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9ophjXvZ0yui4t4hEU4OsZKmaGc-mDaD-Tp4fxnQZyuv3HGXZkRn08Su0kahZvEXujySr7WUiS4uk4LLkfyc_w2vONg4OFSwlIK5BgbmFuHkVPyIgWM1voMCHhnB1y6q-FqqDi2kkof0-Ppt92o_GyWxmRyGHAuBSUWYsr0qwJ07UnU7i1ZtIde3WmRrvtsaVOlVlaiPzZxZwfaUHEaPr7aoKkIglVFHPqPNVkCTWZWFgQlzNO1wyfE28ttvy1zM1SqhvDd7vSgc'
WHERE id = 3;

-- Pista Fútbol Sala - Premium VIP outdoor
UPDATE pistas 
SET imagen = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDAbYP2G1mIPhO1skYKTs6ruEdJJ30TKJySpWiPphR6nrTBZgo_vE4aCMQnImilw9TL0SvJXdD-QYFULClqUllOmbVVWGtxwoyHbqL-lNl-vYIgy1nS52-kA4q_Lcd7cuLI8J4WepjMxCyfP0d857p1aqC00vdRyIkRw1hfhDx0LfBO-_5UdjEpOqVyXvaoKYvRb-gSFHi5CetgKbZ8_by1oYbi2y5mzSCIsS0LLXOp8_VQH4sTyvD2qywRMbYqHxejiFlTWbuRJU'
WHERE id = 4;

-- Pista Baloncesto - Outdoor con paredes azules
UPDATE pistas 
SET imagen = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC26FK9jjvw-oIHpuNX6Yirdd0Po2xHTZ2A6vkI6F5qJXrPQqL4Hr13qANCWqgJXkKjBTEI1G7CuPT5Sgc5svm1IbXj-erKr_r7UOLwiH6evUaECcV2XyqB3q8ngUAKm1vtjXo1KCqjfWc0v3gUixWmPodGj63xr4nF10xBg7ax18h9HVvVjQAqm8tXlg-cL10ZOUqm5LVGGytH22O7zWFOFYasBUrTfKjTDLvRw108rK7EWI0CkhYKAZn77htVrE9m0Z6RH-s02M4'
WHERE id = 5;

-- Verificar los cambios
SELECT id, nombre, tipo, imagen FROM pistas ORDER BY id;
