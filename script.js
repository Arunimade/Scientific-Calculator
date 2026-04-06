let expr = '';
let justCalc = false;

const disp = () => document.getElementById('display');
const exprEl = () => document.getElementById('expr');

function setDisplay(val, isErr) {
    const el = disp();
    el.value = val;
    el.style.color = isErr ? '#e24b4a' : '#fff';
}

function appendNum(val) {
    if (justCalc) { expr = ''; justCalc = false; }
    expr += val;
    exprEl().textContent = expr;
    setDisplay(expr || '0');
}

function appendOp(val) {
    if (justCalc) justCalc = false;
    expr += val;
    exprEl().textContent = expr;
    setDisplay(expr || '0');
}

function dot() {
    const parts = expr.split(/[\+\-\*\/\^\(]/);
    if (!parts[parts.length - 1].includes('.')) {
        appendOp('.');
    }
}

function clearAll() {
    expr = '';
    justCalc = false;
    exprEl().textContent = '';
    setDisplay('0');
}

function delChar() {
    if (justCalc) { clearAll(); return; }
    expr = expr.slice(0, -1);
    exprEl().textContent = expr;
    setDisplay(expr || '0');
}

function fmtNum(n) {
    if (!isFinite(n)) return 'Error';
    return String(parseFloat(n.toPrecision(12)));
}

function factorial(n) {
    n = Math.floor(n);
    if (n < 0 || n > 170) return NaN;
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function sci(fn) {
    const cur = expr;
    if (fn === 'fact') {
        try {
            const v = cur ? eval(cur.replace(/\^/g, '**')) : 0;
            const r = factorial(v);
            exprEl().textContent = cur + '!';
            expr = String(isFinite(r) ? r : NaN);
            setDisplay(isFinite(r) ? fmtNum(r) : 'Error', !isFinite(r));
            justCalc = true;
        } catch { setDisplay('Error', true); }
        return;
    }
    if (fn === 'sq') {
        expr += '^2';
        exprEl().textContent = expr;
        setDisplay(expr);
        return;
    }
    const map = {
        sin: 'Math.sin',
        cos: 'Math.cos',
        tan: 'Math.tan',
        log: 'Math.log10',
        ln: 'Math.log',
        sqrt: 'Math.sqrt'
    };
    const inner = cur || '0';
    try {
        const v = eval(inner.replace(/\^/g, '**'));
        const r = eval(map[fn] + '(' + v + ')');
        exprEl().textContent = fn + '(' + inner + ')';
        expr = String(r);
        setDisplay(isFinite(r) ? fmtNum(r) : 'Error', !isFinite(r));
        justCalc = true;
    } catch { setDisplay('Error', true); }
}

function calculate() {
    if (!expr) return;
    try {
        const result = eval(expr.replace(/\^/g, '**').replace(/%/g, '/100'));
        exprEl().textContent = expr + ' =';
        if (!isFinite(result)) {
            setDisplay('Error', true);
            expr = '';
            return;
        }
        const out = fmtNum(result);
        setDisplay(out);
        expr = out;
        justCalc = true;
    } catch {
        setDisplay('Error', true);
        expr = '';
    }
}
