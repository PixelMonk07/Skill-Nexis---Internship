function Card({ name, role, description }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <h4>{role}</h4>
      <p>{description}</p>
    </div>
  );
} 

export default Card;