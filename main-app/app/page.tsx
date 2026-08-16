export default function MainHome() {
  return (
    <div style={{ padding: 40, background: "#fef3c7", minHeight: "100vh" }}>
      <h1>🟨 Đây là MAIN-APP (chạy port 3000)</h1>
      <p>Đây là ứng dụng shell, xử lý trang chủ.</p>
      <p>
        Bấm vào đây để sang zone khác:{" "}
        <a href="/blog">Đi tới Blog (thực chất chạy ở port 3001)</a>
      </p>
    </div>
  );
}