const MAX_GPA = 10;
const GRADE_POINTS = { s: 10, a: 9, b: 8, c: 7, d: 6, e: 5, f: 0 };

function parseNum(value) {
    if (value === '' || value === null || value === undefined) return NaN;
    return Number(value);
}

const fmt = (n) => n.toFixed(2);

function computeGPA(courses) {
    let points = 0, credits = 0;
    const invalid = [];
    courses.forEach((c, i) => {
        const cr = parseNum(c.credits);
        const hasGrade = c.grade !== '' && c.grade !== undefined;
        if (Number.isNaN(cr) && !hasGrade) return;                
        if (!(cr > 0) || !(c.grade in GRADE_POINTS)) { invalid.push(i); return; }
        points += cr * GRADE_POINTS[c.grade];
        credits += cr;
    });
    return { gpa: credits > 0 ? points / credits : null, credits, invalid };
}

function computeCGPA(semesters) {
    let points = 0, credits = 0;
    const invalid = [];
    semesters.forEach((s, i) => {
        const cr = parseNum(s.credits);
        const g = parseNum(s.gpa);
        if (Number.isNaN(cr) && Number.isNaN(g)) return;           
        if (!(cr > 0) || Number.isNaN(g) || g < 0 || g > MAX_GPA) { invalid.push(i); return; }
        points += cr * g;
        credits += cr;
    });
    return { cgpa: credits > 0 ? points / credits : null, credits, invalid };
}

function computeEstimate({ current, done, target, upcoming }) {
    const cur = parseNum(current), d = parseNum(done);
    const t = parseNum(target), up = parseNum(upcoming);
    if ([cur, d, t, up].some(Number.isNaN)) return { status: 'invalid', reason: 'Fill in all four fields.' };
    if (cur < 0 || cur > MAX_GPA || t < 0 || t > MAX_GPA) {
        return { status: 'invalid', reason: `CGPA values must be between 0 and ${MAX_GPA}.` };
    }
    if (d < 0) return { status: 'invalid', reason: 'Credits completed cannot be negative.' };
    if (!(up > 0)) return { status: 'invalid', reason: 'Upcoming credits must be greater than 0.' };

    const required = (t * (d + up) - cur * d) / up;
    if (required <= 0) return { status: 'secured', required: 0 };

    const rounded = Math.ceil(required * 100 - 1e-9) / 100;
    if (rounded > MAX_GPA) {
        return { status: 'unreachable', required: rounded, best: (cur * d + MAX_GPA * up) / (d + up) };
    }
    return { status: 'ok', required: rounded };
}

if (typeof module !== 'undefined') {
    module.exports = { computeGPA, computeCGPA, computeEstimate, parseNum };
}

if (typeof document !== 'undefined') {
(function () {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const TABS = ['gpa', 'cgpa', 'estimate'];
    const nav = $('#nav'), menuBtn = $('#menu-btn'), scrim = $('#scrim');

    function showTab(name) {
        if (!TABS.includes(name)) name = 'gpa';
        TABS.forEach((t) => {
            const active = t === name;
            $('#panel-' + t).hidden = !active;
            const tab = $('#tab-' + t);
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
        });
        try { localStorage.setItem('activeSection', name); } catch (e) { /* storage unavailable */ }
    }

    function setDrawer(open) {
        nav.classList.toggle('open', open);
        scrim.hidden = !open;
        menuBtn.setAttribute('aria-expanded', String(open));
    }

    $$('.tab').forEach((tab) => {
        tab.addEventListener('click', () => { showTab(tab.dataset.tab); setDrawer(false); });
        tab.addEventListener('keydown', (e) => {
            const i = TABS.indexOf(tab.dataset.tab);
            let next = null;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = TABS[(i + 1) % TABS.length];
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = TABS[(i + TABS.length - 1) % TABS.length];
            if (next) { e.preventDefault(); showTab(next); $('#tab-' + next).focus(); }
        });
    });
    menuBtn.addEventListener('click', () => setDrawer(true));
    $('#nav-close').addEventListener('click', () => { setDrawer(false); menuBtn.focus(); });
    scrim.addEventListener('click', () => setDrawer(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });

    const courseRows = $('#course-rows'), semRows = $('#sem-rows');

    function addRow(container, templateId, focus = true) {
        const row = $(templateId).content.firstElementChild.cloneNode(true);
        container.appendChild(row);
        if (focus) $('input', row).focus();
        return row;
    }

    function clearRow(row) {
        $$('input', row).forEach((i) => { i.value = ''; });
        $$('select', row).forEach((s) => { s.value = ''; });
        row.classList.remove('invalid');
    }

    function removeRow(container, row, templateId) {
        if (container.children.length <= 1) { clearRow(row); return; }  
        row.remove();
    }

    [[courseRows, '#course-template'], [semRows, '#sem-template']].forEach(([container, tpl]) => {
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.remove');
            if (btn) removeRow(container, btn.closest('.row'), tpl);
        });
        
        container.addEventListener('input', (e) => e.target.closest('.row')?.classList.remove('invalid'));
        container.addEventListener('change', (e) => e.target.closest('.row')?.classList.remove('invalid'));
    });

    function setResult(prefix, value, note = '', state = '') {
        $('#' + prefix + '-value').textContent = value;
        const n = $('#' + prefix + '-note');
        n.textContent = note;
        n.className = 'result-note' + (state ? ' ' + state : '');
    }

    function markInvalid(rows, indices) {
        rows.forEach((r, i) => r.classList.toggle('invalid', indices.includes(i)));
    }

    const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

    // ----- GPA -----
    function calcGPA() {
        const rows = $$('.row', courseRows);
        const data = rows.map((r) => ({
            credits: $('.course-credits', r).value,
            grade: $('.course-grade', r).value,
        }));
        const { gpa, credits, invalid } = computeGPA(data);
        markInvalid(rows, invalid);
        const skipped = invalid.length
            ? `${plural(invalid.length, 'row')} skipped: each course needs credits above 0 and a grade.` : '';
        if (gpa === null) {
            setResult('gpa', '—', skipped || 'Add at least one course with credits and a grade.', invalid.length ? 'warn' : '');
            return;
        }
        setResult('gpa', fmt(gpa), `${credits} credits${skipped ? ' · ' + skipped : ''}`, invalid.length ? 'warn' : '');
    }

    function resetGPA() {
        courseRows.innerHTML = '';
        addRow(courseRows, '#course-template', false);
        setResult('gpa', '—');
    }

    // ----- CGPA -----
    function calcCGPA() {
        const rows = $$('.row', semRows);
        const data = rows.map((r) => ({
            credits: $('.sem-credits', r).value,
            gpa: $('.sem-gpa', r).value,
        }));
        const { cgpa, credits, invalid } = computeCGPA(data);
        markInvalid(rows, invalid);
        const skipped = invalid.length
            ? `${plural(invalid.length, 'row')} skipped: each semester needs credits above 0 and a GPA from 0 to ${MAX_GPA}.` : '';
        if (cgpa === null) {
            setResult('cgpa', '—', skipped || 'Add at least one semester with credits and a GPA.', invalid.length ? 'warn' : '');
            return;
        }
        setResult('cgpa', fmt(cgpa), `${credits} credits${skipped ? ' · ' + skipped : ''}`, invalid.length ? 'warn' : '');
    }

    function resetCGPA() {
        semRows.innerHTML = '';
        addRow(semRows, '#sem-template', false);
        setResult('cgpa', '—');
    }

    const est = {
        current: $('#est-cgpa'), done: $('#est-done'),
        target: $('#est-target'), upcoming: $('#est-upcoming'),
    };

    function calcEstimate() {
        const r = computeEstimate({
            current: est.current.value, done: est.done.value,
            target: est.target.value, upcoming: est.upcoming.value,
        });
        switch (r.status) {
            case 'invalid':
                setResult('est', '—', r.reason, 'warn'); break;
            case 'secured':
                setResult('est', '0.00', 'Target already secured: even a 0.00 next semester keeps you at or above it.'); break;
            case 'unreachable':
                setResult('est', fmt(r.required),
                    `Not reachable next semester. A perfect ${MAX_GPA}.00 would give you ${fmt(r.best)}.`, 'warn'); break;
            default:
                setResult('est', fmt(r.required), 'Minimum GPA needed across your upcoming credits.');
        }
    }

    function resetEstimate() {
        Object.values(est).forEach((i) => { i.value = ''; });
        setResult('est', '—');
    }

    $('#add-course').addEventListener('click', () => addRow(courseRows, '#course-template'));
    $('#add-sem').addEventListener('click', () => addRow(semRows, '#sem-template'));
    $('#calc-gpa').addEventListener('click', calcGPA);
    $('#calc-cgpa').addEventListener('click', calcCGPA);
    $('#calc-est').addEventListener('click', calcEstimate);
    $('#reset-gpa').addEventListener('click', resetGPA);
    $('#reset-cgpa').addEventListener('click', resetCGPA);
    $('#reset-est').addEventListener('click', resetEstimate);

    [['#panel-gpa', calcGPA], ['#panel-cgpa', calcCGPA], ['#panel-estimate', calcEstimate]].forEach(([sel, fn]) => {
        $(sel).addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); fn(); }
        });
    });

    addRow(courseRows, '#course-template', false);
    addRow(semRows, '#sem-template', false);
    let saved = 'gpa';
    try { saved = (localStorage.getItem('activeSection') || 'gpa').toLowerCase(); } catch (e) { /* ignore */ }
    showTab(saved);
})();
}
