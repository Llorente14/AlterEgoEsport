import bpy
from pathlib import Path

BASE      = Path(__file__).resolve().parent
LAYER_DIR = BASE / "layers"
WIDTH     = 2.0      # lebar logo (unit Blender / Three.js)
BEVEL     = 0.006

# Tebal tiap layer diukur dari belakang (z=0). Makin besar makin menonjol.
DEPTH = {
    "red_outer": 0.16, "black": 0.22, "gray_dark": 0.27, "gray_mid": 0.29,
    "gray_light": 0.31, "white": 0.33, "red_detail": 0.34,
}
MAT = {  # (warna sRGB, roughness, metallic)
    "red_outer":  ((0.88, 0.10, 0.07), 0.35, 0.2),
    "red_detail": ((0.93, 0.11, 0.07), 0.30, 0.2),
    "black":      ((0.04, 0.04, 0.05), 0.45, 0.1),
    "gray_dark":  ((0.31, 0.31, 0.31), 0.55, 0.0),
    "gray_mid":   ((0.47, 0.47, 0.47), 0.55, 0.0),
    "gray_light": ((0.70, 0.70, 0.70), 0.55, 0.0),
    "white":      ((1.00, 1.00, 1.00), 0.40, 0.0),
}

def lin(c):  # sRGB → linear (Blender base color linear)
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1,)

def select(objs):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]

bpy.ops.wm.read_factory_settings(use_empty=True)
try:
    bpy.ops.preferences.addon_enable(module="io_curve_svg")
except Exception:
    pass

# 1) Import SVG → curve → mesh datar, gabung per layer
layers = []
for svg in sorted(LAYER_DIR.glob("*.svg")):
    name = svg.stem.split("_", 1)[1]
    before = set(bpy.data.objects)
    bpy.ops.import_curve.svg(filepath=str(svg))
    objs = [o for o in bpy.data.objects if o not in before and o.type == "CURVE"]
    if not objs:
        continue
    for o in objs:
        o.data.dimensions = "2D"
        o.data.fill_mode = "BOTH"
        o.data.resolution_u = 24
    select(objs)
    bpy.ops.object.convert(target="MESH")
    if len(objs) > 1:
        bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    obj.name = name
    layers.append((name, obj))

# 2) Normalisasi ukuran & posisikan ke tengah
xs = [v.co.x for _, o in layers for v in o.data.vertices]
ys = [v.co.y for _, o in layers for v in o.data.vertices]
cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
f = WIDTH / (max(xs) - min(xs))

root = bpy.data.objects.new("AlterEgoLogo", None)
bpy.context.scene.collection.objects.link(root)

for name, obj in layers:
    me = obj.data
    for v in me.vertices:
        v.co = ((v.co.x - cx) * f, (v.co.y - cy) * f, 0.0)
    me.update()
    select([obj])
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=1e-5)
    bpy.ops.object.mode_set(mode="OBJECT")
    for p in me.polygons:          # pastikan normal menghadap +Z (depan)
        if p.normal.z < 0:
            p.flip()
    me.update()

    # 3) Ketebalan (Solidify) + bevel. Tetap editable di .blend.
    sol = obj.modifiers.new("Depth", "SOLIDIFY")
    sol.thickness = DEPTH.get(name, 0.2)
    sol.offset = 1.0
    sol.use_even_offset = True
    bev = obj.modifiers.new("Bevel", "BEVEL")
    bev.width = BEVEL
    bev.segments = 2
    bev.limit_method = "ANGLE"

    # Material
    col, rough, metal = MAT.get(name, ((0.5, 0.5, 0.5), 0.5, 0.0))
    m = bpy.data.materials.new(f"M_{name}")
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = lin(col)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    me.materials.clear()
    me.materials.append(m)

    obj.parent = root

# 4) Simpan & export
bpy.ops.wm.save_as_mainfile(filepath=str(BASE / "alterego_logo.blend"))
bpy.ops.export_scene.gltf(
    filepath=str(BASE / "alterego_logo.glb"),
    export_format="GLB",
    export_apply=True,
)
print("✓ alterego_logo.blend & alterego_logo.glb")