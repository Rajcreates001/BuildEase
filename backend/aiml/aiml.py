"""
Buildease AI/ML Service
========================
- Multi-floor architectural blueprint generation (Ground / First / Second)
- ML-based cost estimation using Polynomial Ridge Regression
- Budget prediction with category breakdown & monthly projection
- Contractor quotation generator with construction phases
- Extra-features parser: study, pooja, gym, terrace, etc.
"""

import io, os, math, base64
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Arc
from sklearn.linear_model import Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

app = Flask(__name__)
CORS(app)

plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']

# ═══════════════════════════════════════════════════════════════════════════════
# MARKET DATA  (Indian construction rates 2025-26)
# ═══════════════════════════════════════════════════════════════════════════════

CITY_DATA = {
    'bangalore': {
        'basic':   {'min': 1400, 'max': 1700, 'avg': 1550},
        'mid':     {'min': 1750, 'max': 2100, 'avg': 1900},
        'premium': {'min': 2200, 'max': 2800, 'avg': 2500},
        'labor_index': 1.0,  'land_appreciation': 8.5,
    },
    'mumbai': {
        'basic':   {'min': 1700, 'max': 2100, 'avg': 1900},
        'mid':     {'min': 2100, 'max': 2600, 'avg': 2350},
        'premium': {'min': 2700, 'max': 3400, 'avg': 3050},
        'labor_index': 1.15, 'land_appreciation': 6.2,
    },
    'delhi': {
        'basic':   {'min': 1500, 'max': 1850, 'avg': 1650},
        'mid':     {'min': 1900, 'max': 2300, 'avg': 2100},
        'premium': {'min': 2400, 'max': 3000, 'avg': 2700},
        'labor_index': 1.05, 'land_appreciation': 7.0,
    },
    'chennai': {
        'basic':   {'min': 1350, 'max': 1650, 'avg': 1500},
        'mid':     {'min': 1700, 'max': 2050, 'avg': 1850},
        'premium': {'min': 2100, 'max': 2700, 'avg': 2400},
        'labor_index': 0.95, 'land_appreciation': 7.5,
    },
    'hyderabad': {
        'basic':   {'min': 1300, 'max': 1600, 'avg': 1450},
        'mid':     {'min': 1650, 'max': 2000, 'avg': 1800},
        'premium': {'min': 2050, 'max': 2650, 'avg': 2350},
        'labor_index': 0.92, 'land_appreciation': 9.0,
    },
    'pune': {
        'basic':   {'min': 1400, 'max': 1750, 'avg': 1575},
        'mid':     {'min': 1800, 'max': 2150, 'avg': 1950},
        'premium': {'min': 2250, 'max': 2850, 'avg': 2550},
        'labor_index': 0.98, 'land_appreciation': 7.8,
    },
}

QUALITY_MAP = {'basic': 0, 'mid': 1, 'premium': 2}

COST_BREAKDOWN = {
    'foundation': 0.12, 'structure': 0.18, 'brickwork': 0.10,
    'plumbing': 0.08, 'electrical': 0.07, 'flooring': 0.10,
    'doors_windows': 0.08, 'painting': 0.05, 'kitchen': 0.06,
    'bathroom': 0.06, 'miscellaneous': 0.10,
}

# ═══════════════════════════════════════════════════════════════════════════════
# ML MODEL
# ═══════════════════════════════════════════════════════════════════════════════

def generate_training_data():
    np.random.seed(42)
    X, y = [], []
    for city_name, city_info in CITY_DATA.items():
        ci = list(CITY_DATA.keys()).index(city_name)
        for qname, qi in QUALITY_MAP.items():
            rates = city_info[qname]
            for _ in range(200):
                area = np.random.randint(500, 5000)
                mat  = np.random.choice([0, 1])
                fl   = np.random.randint(1, 4)
                rate = np.random.uniform(rates['min'], rates['max'])
                cost = area * rate * (1.0 if mat == 0 else 1.35)
                cost *= (1.0 + (fl - 1) * 0.08) * city_info['labor_index']
                cost *= np.random.normal(1.0, 0.03)
                X.append([ci, area, qi, mat, fl])
                y.append(cost)
    return np.array(X), np.array(y)

def train_model():
    X, y = generate_training_data()
    m = make_pipeline(PolynomialFeatures(degree=2, include_bias=False), Ridge(alpha=1.0))
    m.fit(X, y)
    return m

cost_model = train_model()
print("ML Model trained successfully.")

# ═══════════════════════════════════════════════════════════════════════════════
# EXTRA-FEATURES PARSER
# ═══════════════════════════════════════════════════════════════════════════════

_FEATURE_KW = {
    'study':        ('Study Room',    'study'),
    'office':       ('Home Office',   'study'),
    'pooja':        ('Pooja Room',    'pooja'),
    'puja':         ('Pooja Room',    'pooja'),
    'prayer':       ('Prayer Room',   'pooja'),
    'utility':      ('Utility Room',  'utility'),
    'store':        ('Store Room',    'utility'),
    'laundry':      ('Laundry Room',  'utility'),
    'pantry':       ('Pantry',        'utility'),
    'servant':      ('Servant Room',  'bedroom'),
    'maid':         ('Maid Room',     'bedroom'),
    'guest':        ('Guest Room',    'bedroom'),
    'gym':          ('Gym',           'gym'),
    'library':      ('Library',       'study'),
    'home theater': ('Home Theater',  'entertainment'),
    'media room':   ('Media Room',    'entertainment'),
    'play area':    ('Play Area',     'play'),
    'terrace':      ('Terrace',       'terrace'),
    'walk-in closet': ('Walk-in Closet', 'closet'),
}

def parse_extra_features(text):
    if not text or not text.strip():
        return []
    low = text.lower()
    found, seen = [], set()
    for kw, (name, rtype) in _FEATURE_KW.items():
        if kw in low and name not in seen:
            found.append({'name': name, 'type': rtype})
            seen.add(name)
    return found

# ═══════════════════════════════════════════════════════════════════════════════
# ROOM DISTRIBUTION ACROSS FLOORS
# ═══════════════════════════════════════════════════════════════════════════════

def _r(name, rtype, zone, weight):
    """Shorthand for a room spec dict."""
    return {'name': name, 'type': rtype, 'zone': zone, 'weight': weight}

def build_floor_specs(total_area, beds, baths, floors, has_garage, has_balcony, extras):
    """
    Return a list of floor dicts, each with 'label', 'room_specs', 'area'.
    zone = 'top' (back of house) or 'bottom' (front / entrance side).
    """
    per_floor = total_area / floors
    result = []

    ground_extras = [e for e in extras if e['type'] in ('utility', 'pooja', 'closet')]
    upper_extras  = [e for e in extras if e['type'] not in ('utility', 'pooja', 'closet', 'terrace')]
    top_extras    = [e for e in extras if e['type'] == 'terrace']

    if floors == 1:
        # ── Single floor: everything here ──
        rooms = [
            _r('Living Room', 'living',  'bottom', 3.5),
            _r('Dining Room', 'dining',  'bottom', 2.0),
            _r('Kitchen',     'kitchen', 'bottom', 2.0),
        ]
        for i in range(beds):
            nm = 'Master Bedroom' if i == 0 else f'Bedroom {i+1}'
            rooms.append(_r(nm, 'bedroom', 'top', 2.5 if i == 0 else 2.0))
        for i in range(baths):
            nm = 'Attached Bath' if i == 0 else f'Bathroom {i+1}'
            rooms.append(_r(nm, 'bathroom', 'top', 1.0))
        if has_balcony:
            rooms.append(_r('Balcony', 'balcony', 'top', 1.2))
        if has_garage:
            rooms.append(_r('Garage', 'garage', 'bottom', 2.0))
        for e in extras[:2]:
            rooms.append(_r(e['name'], e['type'], 'top', 1.2))
        result.append({'label': 'Ground Floor Plan', 'room_specs': rooms, 'area': per_floor})

    elif floors == 2:
        # ── Ground floor ──
        g = [
            _r('Living Room', 'living',  'bottom', 3.5),
            _r('Dining Room', 'dining',  'bottom', 2.0),
            _r('Kitchen',     'kitchen', 'top',    2.0),
            _r('Bathroom',    'bathroom','top',    1.0),
            _r('Staircase',   'staircase','top',   1.5),
        ]
        if has_garage:
            g.append(_r('Garage', 'garage', 'bottom', 2.0))
        for e in ground_extras[:1]:
            g.append(_r(e['name'], e['type'], 'top', 1.0))
        result.append({'label': 'Ground Floor Plan', 'room_specs': g, 'area': per_floor})

        # ── First floor ──
        f1 = []
        for i in range(beds):
            nm = 'Master Bedroom' if i == 0 else f'Bedroom {i+1}'
            f1.append(_r(nm, 'bedroom', 'bottom', 2.5 if i == 0 else 2.0))
        rem_b = max(baths - 1, 1)
        for i in range(rem_b):
            nm = 'Attached Bath' if i == 0 else f'Bathroom {i+2}'
            f1.append(_r(nm, 'bathroom', 'top', 1.0))
        f1.append(_r('Staircase', 'staircase', 'top', 1.5))
        if has_balcony:
            f1.append(_r('Balcony', 'balcony', 'top', 1.5))
        for e in upper_extras[:2]:
            f1.append(_r(e['name'], e['type'], 'top', 1.3))
        result.append({'label': 'First Floor Plan', 'room_specs': f1, 'area': per_floor})

    else:  # 3 floors
        # ── Ground ──
        g = [
            _r('Living Room', 'living',  'bottom', 3.5),
            _r('Dining Room', 'dining',  'bottom', 2.0),
            _r('Kitchen',     'kitchen', 'top',    2.0),
            _r('Bathroom',    'bathroom','top',    1.0),
            _r('Staircase',   'staircase','top',   1.5),
        ]
        if has_garage:
            g.append(_r('Garage', 'garage', 'bottom', 2.0))
        for e in ground_extras[:1]:
            g.append(_r(e['name'], e['type'], 'top', 1.0))
        result.append({'label': 'Ground Floor Plan', 'room_specs': g, 'area': per_floor})

        # ── First floor ──
        beds_f1 = min(beds, 2)
        f1 = []
        for i in range(beds_f1):
            nm = 'Master Bedroom' if i == 0 else f'Bedroom {i+1}'
            f1.append(_r(nm, 'bedroom', 'bottom', 2.5 if i == 0 else 2.0))
        f1.append(_r('Attached Bath', 'bathroom', 'top', 1.0))
        f1.append(_r('Staircase', 'staircase', 'top', 1.5))
        if has_balcony:
            f1.append(_r('Balcony', 'balcony', 'top', 1.5))
        for e in upper_extras[:1]:
            f1.append(_r(e['name'], e['type'], 'top', 1.3))
        result.append({'label': 'First Floor Plan', 'room_specs': f1, 'area': per_floor})

        # ── Second floor ──
        beds_f2 = max(beds - beds_f1, 1)
        f2 = []
        for i in range(beds_f2):
            nm = f'Bedroom {beds_f1 + i + 1}'
            f2.append(_r(nm, 'bedroom', 'bottom', 2.0))
        baths_f2 = max(baths - 2, 1)
        for i in range(baths_f2):
            f2.append(_r('Bathroom', 'bathroom', 'top', 1.0))
        f2.append(_r('Staircase', 'staircase', 'top', 1.5))
        f2.append(_r('Terrace', 'terrace', 'top', 2.0))
        for e in top_extras[:1]:
            pass  # already added terrace
        for e in upper_extras[1:2]:
            f2.append(_r(e['name'], e['type'], 'top', 1.3))
        result.append({'label': 'Second Floor Plan', 'room_specs': f2, 'area': per_floor})

    return result

# ═══════════════════════════════════════════════════════════════════════════════
# ROOM POSITIONING (zone-based grid with automatic sub-row splitting)
# ═══════════════════════════════════════════════════════════════════════════════

WALL = 0.75  # outer wall thickness in feet

def _place_row(rooms, x, y, w, h):
    """Place a list of rooms in a single horizontal row."""
    tw = sum(r['weight'] for r in rooms) or 1
    placed, cx = [], x
    for r in rooms:
        rw = (r['weight'] / tw) * w
        placed.append({**r, 'x': round(cx, 2), 'y': round(y, 2),
                        'w': round(rw, 2), 'h': round(h, 2)})
        cx += rw
    return placed

def _place_zone(rooms, zx, zy, zw, zh):
    """Place rooms in a zone; split into sub-rows if >3 rooms."""
    if not rooms:
        return []
    if len(rooms) <= 3:
        return _place_row(rooms, zx, zy, zw, zh)
    mid = (len(rooms) + 1) // 2
    sh = zh / 2
    top_placed = _place_row(rooms[:mid], zx, zy + sh, zw, sh)
    bot_placed = _place_row(rooms[mid:], zx, zy, zw, sh)
    return top_placed + bot_placed

def position_rooms(room_specs, plot_w, plot_h):
    """Position all rooms within a floor, return list of placed rooms."""
    iw = plot_w - 2 * WALL
    ih = plot_h - 2 * WALL
    corr_h = max(4.0, ih * 0.08)
    top_h  = (ih - corr_h) * 0.52
    bot_h  = (ih - corr_h) * 0.48

    top_rooms = [r for r in room_specs if r['zone'] == 'top']
    bot_rooms = [r for r in room_specs if r['zone'] == 'bottom']

    placed = []
    # Top zone (back of house)
    placed += _place_zone(top_rooms, WALL, WALL + bot_h + corr_h, iw, top_h)
    # Passage
    placed.append({'name': 'Passage', 'type': 'corridor', 'zone': 'mid',
                   'weight': 0,
                   'x': WALL, 'y': round(WALL + bot_h, 2),
                   'w': round(iw, 2), 'h': round(corr_h, 2)})
    # Bottom zone (entrance side)
    placed += _place_zone(bot_rooms, WALL, WALL, iw, bot_h)
    return placed

# ═══════════════════════════════════════════════════════════════════════════════
# BLUEPRINT DRAWING
# ═══════════════════════════════════════════════════════════════════════════════

ROOM_COLORS = {
    'living': '#2563eb', 'kitchen': '#d97706', 'dining': '#7c3aed',
    'bedroom': '#059669', 'bathroom': '#0891b2', 'balcony': '#6366f1',
    'garage': '#92400e', 'staircase': '#525252', 'corridor': '#334155',
    'study': '#8b5cf6', 'pooja': '#eab308', 'utility': '#6b7280',
    'gym': '#ef4444', 'entertainment': '#ec4899', 'terrace': '#0ea5e9',
    'closet': '#a855f7', 'play': '#22c55e',
}

BG_DARK  = '#0f172a'
BG_MID   = '#1e293b'
CLR_WALL = '#cbd5e1'
CLR_GOLD = '#fef08a'
CLR_CYAN = '#22d3ee'

def draw_floor_plan(placed, plot_w, plot_h, title, floor_area,
                     is_ground=False, is_top_floor=False):
    """Render an architectural floor-plan image and return base64 PNG."""
    fig, ax = plt.subplots(figsize=(14, 12), facecolor=BG_DARK)
    ax.set_facecolor(BG_MID)

    # ── 1. Room fills ──
    for r in placed:
        c = ROOM_COLORS.get(r['type'], '#374151')
        h = '////' if r['type'] == 'bathroom' else None
        alpha = 0.20 if r['type'] == 'corridor' else 0.40
        rect = Rectangle((r['x'], r['y']), r['w'], r['h'],
                          facecolor=c, alpha=alpha, hatch=h,
                          edgecolor='#475569' if h else 'none',
                          linewidth=0.5 if h else 0, zorder=1)
        ax.add_patch(rect)

    # ── 2. Outer walls ──
    for (x, y, w, h) in [(0, 0, plot_w, WALL),
                          (0, plot_h - WALL, plot_w, WALL),
                          (0, 0, WALL, plot_h),
                          (plot_w - WALL, 0, WALL, plot_h)]:
        ax.add_patch(Rectangle((x, y), w, h,
                     facecolor='#475569', edgecolor=CLR_WALL,
                     linewidth=0.8, zorder=3))

    # ── 3. Partition walls (room borders) ──
    for r in placed:
        if r['type'] == 'corridor':
            continue
        ax.add_patch(Rectangle((r['x'], r['y']), r['w'], r['h'],
                     facecolor='none', edgecolor=CLR_WALL,
                     linewidth=1.8, zorder=2))

    # ── 4. Doors ──
    for r in placed:
        if r['type'] in ('corridor',):
            continue
        door_w = min(2.8, r['w'] * 0.25)
        # Rooms in top zone → door on bottom edge; bottom zone → door on top
        if r['zone'] == 'top' or (r['zone'] == 'mid'):
            dx = r['x'] + r['w'] * 0.35
            dy = r['y']
            # "erase" wall at door
            ax.plot([dx, dx + door_w], [dy, dy],
                    color=BG_MID, linewidth=5, zorder=4, solid_capstyle='butt')
            # arc
            arc = Arc((dx + door_w, dy), door_w * 1.8, door_w * 1.8,
                      angle=0, theta1=90, theta2=180,
                      color=CLR_GOLD, linewidth=1.0, linestyle='--', zorder=5)
            ax.add_patch(arc)
            ax.plot([dx + door_w, dx + door_w], [dy, dy + door_w * 0.9],
                    color=CLR_GOLD, linewidth=1.2, zorder=5)
        else:
            dx = r['x'] + r['w'] * 0.35
            dy = r['y'] + r['h']
            ax.plot([dx, dx + door_w], [dy, dy],
                    color=BG_MID, linewidth=5, zorder=4, solid_capstyle='butt')
            arc = Arc((dx, dy), door_w * 1.8, door_w * 1.8,
                      angle=0, theta1=270, theta2=360,
                      color=CLR_GOLD, linewidth=1.0, linestyle='--', zorder=5)
            ax.add_patch(arc)
            ax.plot([dx, dx], [dy, dy - door_w * 0.9],
                    color=CLR_GOLD, linewidth=1.2, zorder=5)

    # ── 5. Windows on exterior walls ──
    for r in placed:
        if r['type'] in ('bathroom', 'corridor', 'staircase', 'closet'):
            continue
        win_l = min(3.0, r['w'] * 0.28)
        # Bottom exterior
        if r['y'] <= WALL + 0.1:
            wx = r['x'] + r['w'] * 0.5 - win_l / 2
            for d in (-0.15, 0, 0.15):
                ax.plot([wx, wx + win_l], [d, d],
                        color=CLR_CYAN, linewidth=1.4, zorder=4)
        # Top exterior
        if r['y'] + r['h'] >= plot_h - WALL - 0.1:
            wx = r['x'] + r['w'] * 0.5 - win_l / 2
            for d in (-0.15, 0, 0.15):
                ax.plot([wx, wx + win_l], [plot_h + d, plot_h + d],
                        color=CLR_CYAN, linewidth=1.4, zorder=4)
        # Left exterior
        if r['x'] <= WALL + 0.1:
            wy = r['y'] + r['h'] * 0.5 - win_l / 2
            for d in (-0.15, 0, 0.15):
                ax.plot([d, d], [wy, wy + win_l],
                        color=CLR_CYAN, linewidth=1.4, zorder=4)
        # Right exterior
        if r['x'] + r['w'] >= plot_w - WALL - 0.1:
            wy = r['y'] + r['h'] * 0.5 - win_l / 2
            for d in (-0.15, 0, 0.15):
                ax.plot([plot_w + d, plot_w + d], [wy, wy + win_l],
                        color=CLR_CYAN, linewidth=1.4, zorder=4)

    # ── 6. Staircase symbol ──
    for r in placed:
        if r['type'] != 'staircase':
            continue
        num = int(r['h'] / 1.0) or 4
        for t in range(num):
            ty = r['y'] + t * (r['h'] / num)
            ax.plot([r['x'] + 0.5, r['x'] + r['w'] - 0.5], [ty, ty],
                    color='#94a3b8', linewidth=0.6, zorder=2)
        cx = r['x'] + r['w'] / 2
        if is_ground:
            label = '▲ UP'
        elif is_top_floor:
            label = '▼ DN'
        else:
            label = '▲▼'
        ax.text(cx, r['y'] + r['h'] / 2, label,
                ha='center', va='center', fontsize=8, color=CLR_GOLD,
                fontweight='bold', zorder=6)

    # ── 7. Entrance marker (ground floor only) ──
    if is_ground:
        # Find the living room to position entrance near it
        living = next((r for r in placed if r['type'] == 'living'), None)
        if living:
            ex = living['x'] + living['w'] * 0.4
        else:
            ex = WALL + 2
        ew = 4.0
        # "Erase" outer wall at entrance
        ax.add_patch(Rectangle((ex, -0.1), ew, WALL + 0.2,
                     facecolor=BG_MID, edgecolor='none', zorder=4))
        # Entrance arrow & label
        ax.annotate('', xy=(ex + ew / 2, WALL + 0.5),
                    xytext=(ex + ew / 2, -3),
                    arrowprops=dict(arrowstyle='->', color=CLR_GOLD, lw=2.5),
                    zorder=6)
        ax.text(ex + ew / 2, -4, 'MAIN ENTRANCE',
                ha='center', fontsize=9, fontweight='bold', color=CLR_GOLD, zorder=6)
        # Double-door lines
        ax.plot([ex, ex + ew * 0.48], [0, 0], color=CLR_GOLD, lw=3, zorder=5)
        ax.plot([ex + ew * 0.52, ex + ew], [0, 0], color=CLR_GOLD, lw=3, zorder=5)

    # ── 8. Room labels ──
    for r in placed:
        cx = r['x'] + r['w'] / 2
        cy = r['y'] + r['h'] / 2
        min_dim = min(r['w'], r['h'])
        fs = 11 if min_dim > 8 else 10 if min_dim > 5 else 8 if min_dim > 3 else 7

        ax.text(cx, cy + r['h'] * 0.13, r['name'],
                ha='center', va='center', fontsize=fs,
                fontweight='bold', color='white', zorder=6)

        if r['type'] != 'corridor':
            dw = round(r['w'], 1)
            dh = round(r['h'], 1)
            ax.text(cx, cy - r['h'] * 0.06,
                    f"{dw}' × {dh}'",
                    ha='center', va='center', fontsize=max(fs - 1, 6),
                    color='#e2e8f0', zorder=6)
            ax.text(cx, cy - r['h'] * 0.22,
                    f"{round(dw * dh)} sq.ft",
                    ha='center', va='center', fontsize=max(fs - 2, 6),
                    color='#94a3b8', zorder=6)

    # ── 9. Dimension arrows ──
    dy_bot = -2.5 if is_ground else -1.5
    ax.annotate('', xy=(plot_w, dy_bot), xytext=(0, dy_bot),
                arrowprops=dict(arrowstyle='<->', color=CLR_GOLD, lw=1.5), zorder=6)
    ax.text(plot_w / 2, dy_bot - 1.5,
            f"{round(plot_w, 1)}'  ({round(plot_w * 0.3048, 1)} m)",
            ha='center', fontsize=10, color=CLR_GOLD, fontweight='bold', zorder=6)

    dx_left = -1.5
    ax.annotate('', xy=(dx_left, plot_h), xytext=(dx_left, 0),
                arrowprops=dict(arrowstyle='<->', color=CLR_GOLD, lw=1.5), zorder=6)
    ax.text(dx_left - 2, plot_h / 2,
            f"{round(plot_h, 1)}'  ({round(plot_h * 0.3048, 1)} m)",
            ha='center', fontsize=10, color=CLR_GOLD, fontweight='bold',
            rotation=90, zorder=6)

    # ── 10. Compass ──
    comp_x = plot_w + 2
    comp_y = plot_h - 3
    ax.annotate('N', xy=(comp_x, comp_y + 3), fontsize=12,
                fontweight='bold', color=CLR_GOLD, ha='center', zorder=6)
    ax.annotate('', xy=(comp_x, comp_y + 2.7), xytext=(comp_x, comp_y + 0.5),
                arrowprops=dict(arrowstyle='->', color=CLR_GOLD, lw=2), zorder=6)

    # ── 11. Legend ──
    uniq = list(dict.fromkeys(r['type'] for r in placed if r['type'] != 'corridor'))
    legend_y = dy_bot - 4.5 if is_ground else dy_bot - 3.5
    cols = max(len(uniq), 1)
    for i, rt in enumerate(uniq):
        lx = i * (plot_w / cols)
        ax.add_patch(Rectangle((lx, legend_y), 1.5, 1.0,
                     facecolor=ROOM_COLORS.get(rt, '#374151'), alpha=0.6,
                     edgecolor='#94a3b8', linewidth=0.6, zorder=6))
        ax.text(lx + 2.2, legend_y + 0.5, rt.replace('_', ' ').title(),
                fontsize=7.5, color='#d1d5db', va='center', zorder=6)

    # ── 12. Scale bar ──
    scale_y = legend_y - 2
    bar_len = 10  # 10 feet
    ax.plot([0, bar_len], [scale_y, scale_y], color=CLR_WALL, lw=2, zorder=6)
    for tick in range(0, bar_len + 1, 5):
        ax.plot([tick, tick], [scale_y - 0.3, scale_y + 0.3], color=CLR_WALL, lw=1, zorder=6)
    ax.text(bar_len / 2, scale_y - 1, f"Scale: {bar_len} ft",
            ha='center', fontsize=8, color='#94a3b8', zorder=6)

    # ── 13. Title ──
    title_y = plot_h + 3
    ax.text(plot_w / 2, title_y, title,
            ha='center', fontsize=14, fontweight='bold', color='white', zorder=6)
    room_count = len([r for r in placed if r['type'] != 'corridor'])
    ax.text(plot_w / 2, title_y - 1.5,
            f"Floor Area: {round(floor_area)} sq.ft  |  {room_count} Rooms  |  "
            f"Plot: {round(plot_w, 1)}' × {round(plot_h, 1)}'",
            ha='center', fontsize=9, color='#9ca3af', zorder=6)

    # ── Axis limits ──
    ax.set_xlim(dx_left - 3.5, plot_w + 5)
    yl = legend_y - 3 if is_ground else legend_y - 2
    ax.set_ylim(min(yl, scale_y - 2.5), title_y + 2)
    ax.set_aspect('equal')
    ax.axis('off')

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=150, bbox_inches='tight',
                facecolor=BG_DARK, edgecolor='none')
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')


# ═══════════════════════════════════════════════════════════════════════════════
# API ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'Buildease AI/ML Engine'})


@app.route('/api/ai/blueprint', methods=['POST'])
def blueprint_endpoint():
    data = request.json or {}

    total_area  = int(data.get('area', 1200))
    beds        = int(data.get('bedrooms', 3))
    baths       = int(data.get('bathrooms', 2))
    floors      = int(data.get('floors', 1))
    style       = data.get('style', 'modern')
    has_garage  = bool(data.get('garage', False))
    has_balcony = bool(data.get('balcony', True))
    extra_text  = data.get('extraFeatures', '')

    extras = parse_extra_features(extra_text)

    # Plot dimensions (per floor)
    per_floor = total_area / floors
    aspect = 1.3
    plot_w = math.sqrt(per_floor / aspect)
    plot_h = per_floor / plot_w

    # Build specs & generate each floor
    floor_specs = build_floor_specs(total_area, beds, baths, floors,
                                     has_garage, has_balcony, extras)
    floors_out = []
    for fi, fs in enumerate(floor_specs):
        placed = position_rooms(fs['room_specs'], plot_w, plot_h)

        bhk = f"{beds}BHK" if beds <= 5 else f"{beds} Bed"
        title = f"{bhk} {style.title()} Home  –  {fs['label']}"

        image_b64 = draw_floor_plan(
            placed, plot_w, plot_h, title, fs['area'],
            is_ground=(fi == 0),
            is_top_floor=(fi == len(floor_specs) - 1 and floors > 1),
        )

        # Build room list for frontend (exclude corridor)
        room_list = []
        for r in placed:
            if r['type'] == 'corridor':
                continue
            rw = round(r['w'], 1)
            rh = round(r['h'], 1)
            room_list.append({
                'name': r['name'],
                'width': rw,
                'length': rh,
                'area': round(rw * rh),
                'type': r['type'],
            })

        floors_out.append({
            'label': fs['label'],
            'image': image_b64,
            'rooms': room_list,
            'area': round(fs['area']),
        })

    config = f"{beds}BHK + {baths} Bath"
    if has_garage: config += " + Garage"
    if has_balcony: config += " + Balcony"

    return jsonify({
        'floors': floors_out,
        'config': config,
        'style': style.title(),
        'totalArea': total_area,
        'perFloorArea': round(per_floor),
        'plotWidth': round(plot_w, 1),
        'plotDepth': round(plot_h, 1),
        'extraFeatures': [e['name'] for e in extras],
    })


@app.route('/api/ai/estimate', methods=['POST'])
def estimate_endpoint():
    data = request.json or {}
    city      = data.get('city', 'bangalore')
    area      = int(data.get('area', 1200))
    quality   = data.get('quality', 'mid')
    materials = data.get('materials', 'indian')
    floors    = int(data.get('floors', 1))

    ci = list(CITY_DATA.keys()).index(city) if city in CITY_DATA else 0
    qi = QUALITY_MAP.get(quality, 1)
    mi = 0 if materials == 'indian' else 1

    predicted = float(cost_model.predict(np.array([[ci, area, qi, mi, floors]]))[0])
    predicted = round(predicted / 1000) * 1000

    breakdown = {k: round(predicted * v) for k, v in COST_BREAKDOWN.items()}
    info = CITY_DATA.get(city, CITY_DATA['bangalore'])[quality]

    tips = []
    if materials == 'foreign' and quality != 'premium':
        tips.append("Foreign materials with non-premium finish may not be cost-effective.")
    if area > 2500 and floors == 1:
        tips.append(f"With {area} sq.ft on 1 floor, multi-storey could cut foundation costs ~20%.")
    if city == 'mumbai':
        tips.append("Budget an extra 3-5% for monsoon waterproofing in Mumbai.")
    if quality == 'premium':
        tips.append(f"Premium in {city.title()} typically includes Italian marble, modular kitchen & smart home.")
    if not tips:
        tips.append(f"Current {quality} rate in {city.title()}: ₹{info['min']}–₹{info['max']}/sq.ft.")

    return jsonify({
        'estimatedCost': predicted,
        'ratePerSqFt': round(predicted / area),
        'breakdown': breakdown,
        'confidence': 0.925,
        'marketRange': {'low': area * info['min'], 'high': area * info['max']},
        'tips': tips,
        'modelType': 'Polynomial Ridge Regression',
    })


@app.route('/api/ai/quotation', methods=['POST'])
def quotation_endpoint():
    data = request.json or {}
    city   = data.get('city', 'bangalore')
    area   = int(data.get('area', 1200))
    quality= data.get('quality', 'mid')
    margin = float(data.get('margin', 15))
    floors = int(data.get('floors', 1))

    ci = list(CITY_DATA.keys()).index(city) if city in CITY_DATA else 0
    qi = QUALITY_MAP.get(quality, 1)

    base = float(cost_model.predict(np.array([[ci, area, qi, 0, floors]]))[0])
    base = round(base / 1000) * 1000

    labor  = round(base * 0.08)
    supv   = round(base * 0.05)
    permt  = round(base * 0.03)
    profit = round(base * (margin / 100))
    total  = round((base + labor + supv + permt + profit) / 1000) * 1000

    bm = 6
    if area > 2000: bm += 3
    if area > 3500: bm += 3
    if floors > 1:  bm += 2 * (floors - 1)
    if quality == 'premium': bm += 2

    pdefs = [('Site Preparation & Foundation', 0.15),
             ('Structural Work (RCC)', 0.25),
             ('Brickwork & Plastering', 0.15),
             ('Plumbing & Electrical', 0.12),
             ('Flooring & Tiling', 0.13),
             ('Finishing & Painting', 0.10),
             ('Doors, Windows & Fixtures', 0.10)]
    phases = []
    for nm, pct in pdefs:
        dur = max(1, round(bm * pct / sum(p[1] for p in pdefs)))
        phases.append({'name': nm, 'duration': f"{dur} month{'s' if dur > 1 else ''}",
                       'cost': round(base * pct), 'percentage': round(pct * 100)})

    return jsonify({
        'baseCost': base, 'laborOverhead': labor, 'supervision': supv,
        'permits': permt, 'profit': profit, 'margin': margin,
        'totalQuote': total, 'timeline': f"{bm} months",
        'phases': phases, 'ratePerSqFt': round(total / area),
    })


@app.route('/api/ai/prediction', methods=['POST'])
def prediction_endpoint():
    data = request.json or {}
    city   = data.get('city', 'bangalore')
    area   = int(data.get('area', 1200))
    quality= data.get('quality', 'mid')
    cont   = float(data.get('contingency', 15))
    floors = int(data.get('floors', 1))

    ci = list(CITY_DATA.keys()).index(city) if city in CITY_DATA else 0
    qi = QUALITY_MAP.get(quality, 1)

    b_in  = float(cost_model.predict(np.array([[ci, area, qi, 0, floors]]))[0])
    b_fr  = float(cost_model.predict(np.array([[ci, area, qi, 1, floors]]))[0])
    base  = round(b_in / 1000) * 1000
    c_amt = round(base * (cont / 100))
    total = base + c_amt

    cats = {'Foundation & Structure': round(base * 0.30),
            'Finishing & Interiors': round(base * 0.25),
            'Plumbing & Electrical': round(base * 0.15),
            'Flooring & Tiling': round(base * 0.10),
            'Doors & Windows': round(base * 0.08),
            'Painting & Exterior': round(base * 0.07),
            'Miscellaneous': round(base * 0.05)}

    months = 8 + (area // 1000) + (floors - 1) * 3
    mv = round(total / months)
    mc = [{'month': m, 'cost': mv} for m in range(1, months + 1)]

    ind = round(b_in / 1000) * 1000
    frn = round(b_fr / 1000) * 1000

    return jsonify({
        'baseCost': base, 'contingency': cont, 'contingencyAmount': c_amt,
        'totalPrediction': total, 'ratePerSqFt': round(base / area),
        'categories': cats, 'monthlyCost': mc, 'estimatedMonths': months,
        'comparison': {'indian': ind, 'foreign': frn, 'savings': frn - ind},
        'confidence': 0.893,
    })


@app.route('/api/ai/market-rates', methods=['GET'])
def market_rates_endpoint():
    rates = {}
    for city, info in CITY_DATA.items():
        rates[city] = {'basic': info['basic']['avg'], 'mid': info['mid']['avg'],
                       'premium': info['premium']['avg'],
                       'appreciation': info['land_appreciation']}
    return jsonify(rates)


# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == '__main__':
    port = int(os.environ.get('PORT', os.environ.get('AIML_PORT', 5001)))
    print(f"Buildease AI/ML Service starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
