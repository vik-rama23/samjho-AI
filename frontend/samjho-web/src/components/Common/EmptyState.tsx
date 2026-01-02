export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        color: "#555",
        border: "1px dashed #ccc",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
