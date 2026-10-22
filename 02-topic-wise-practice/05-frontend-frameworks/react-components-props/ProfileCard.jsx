import Greeting from "./Greeting";

export default function ProfileCard({ user, children }) {
  return (
    <div className="card">
      <Greeting name={user.name} role={user.role} />
      <p>{user.bio}</p>
      {children}
    </div>
  );
}

// Usage:
// <ProfileCard user={{ name: "Asha", role: "Student", bio: "CSE" }}>
//   <button>Follow</button>
// </ProfileCard>
