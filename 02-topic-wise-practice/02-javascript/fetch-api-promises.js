// Promise chain
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((res) => res.json())
  .then((post) => console.log(post.title))
  .catch((err) => console.error(err));

// Custom promise
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// async/await with Promise.all
async function main() {
  await delay(500);
  const [users, posts] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users").then((r) => r.json()),
    fetch("https://jsonplaceholder.typicode.com/posts").then((r) => r.json()),
  ]);
  console.log(users.length, posts.length);
}

main();
