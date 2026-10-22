export default function Greeting({ name = "Guest", role }) {
  return (
    <h2>
      Hello, {name}! {role && <small>({role})</small>}
    </h2>
  );
}
