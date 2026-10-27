# Grade Calculator

A simple, fast grade calculator for students. Works in any browser, no install or build step.

**Live demo:** https://student-gradecalc.vercel.app/

## Features

- **GPA** - add courses with credits and grades to get your semester GPA
- **CGPA** - combine semesters (credits + GPA) into a cumulative CGPA
- **Estimate** - find the GPA you need next semester to reach a target CGPA
- Input validation: incomplete or invalid rows are highlighted and skipped
- Responsive layout, keyboard accessible, remembers your last open tab

## Grading scale

10-point scale:

| Grade | S | A | B | C | D | E | F |
|-------|---|---|---|---|---|---|---|
| Points | 10 | 9 | 8 | 7 | 6 | 5 | 0 |

## How it's calculated

- **GPA** = sum(credits x grade points) / total credits
- **CGPA** = sum(credits x semester GPA) / total credits
- **Required GPA** = (target x (completed + upcoming credits) - current CGPA x completed credits) / upcoming credits

## Run locally

```bash
git clone https://github.com/Lokesh-Ramineni/GRADE-CALCULATOR.git
cd GRADE-CALCULATOR
```

Then open `index.html` in your browser. Or serve it with any static server:

```bash
npx serve
```

## Project structure

```
index.html   page markup and row templates
style.css    styles and responsive layout
app.js       calculation logic and UI behaviour
```

## Customising the grade scale

Edit the `GRADE_POINTS` object at the top of `app.js` and the options in the grade dropdown in `index.html`. Change `MAX_GPA` if your scale tops out at something other than 10.

## License

See [LICENSE](LICENSE).
