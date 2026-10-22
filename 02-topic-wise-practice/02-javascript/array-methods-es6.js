const students = [
  { name: "Asha", marks: 82 },
  { name: "Ravi", marks: 67 },
  { name: "Meena", marks: 91 },
];

const names = students.map((s) => s.name);
const passed = students.filter((s) => s.marks >= 70);
const total = students.reduce((sum, s) => sum + s.marks, 0);
const topper = students.find((s) => s.marks > 90);
const allPass = students.every((s) => s.marks >= 40);

console.log(names, passed, total / students.length, topper, allPass);

// destructuring, spread, rest
const [first, ...others] = names;
const merged = { ...students[0], grade: "A" };
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
console.log(first, others, merged, sum(1, 2, 3, 4));
