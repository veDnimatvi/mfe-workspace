## Hướng dẫn triển khai chi tiết Mỉcro Front-End Nextjs với Multi-Zones đơn giản trên local — từng bước một

### Bước 0 — Chuẩn bị thư mục làm việc
```
mkdir mfe-workspace
cd mfe-workspace
```
Từ đây bạn sẽ có 2 project con nằm cạnh nhau: main-app và blog-app.

### Bước 1 — Tạo app con blog-app trước
```npx create-next-app@latest blog-app```

Sau khi tạo xong:

```cd blog-app```
#### 1.1 Sửa next.config.ts (hoặc .js)
Mở file next.config.ts (Next 15 mặc định tạo file .ts), thay toàn bộ nội dung:
```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/blog",
};

export default nextConfig;
```
#### 1.2 Sửa package.json để chạy port 3001
Mở package.json, sửa phần scripts:
```
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "eslint"
  }
}
```
#### 1.3 Sửa trang chủ để dễ nhận biết
Mở app/page.tsx, thay nội dung để test cho dễ nhìn:
```
export default function BlogHome() {
  return (
    <div style={{ padding: 40, background: "#e0f2fe", minHeight: "100vh" }}>
      <h1>🟦 Đây là BLOG-APP (chạy port 3001)</h1>
      <p>Route hiện tại: /blog</p>
      <a href="/">← Về trang chủ (main-app)</a>
    </div>
  );
}
```
#### 1.4 Tạo thêm 1 route con để test /blog/:path*
Tạo file app/hello-world/page.tsx:
```
export default function HelloWorld() {
  return (
    <div style={{ padding: 40, background: "#e0f2fe", minHeight: "100vh" }}>
      <h1>🟦 Bài viết: hello-world</h1>
      <p>URL đầy đủ khi chạy qua main-app: /blog/hello-world</p>
    </div>
  );
}
```
#### 1.5 Chạy thử độc lập blog-app trước khi ghép
```npm run dev```

Mở http://localhost:3001/blog → phải thấy trang xanh "BLOG-APP". Mở http://localhost:3001/blog/hello-world cũng phải chạy được. Nếu OK thì để terminal này chạy tiếp, mở terminal mới cho bước sau.

### Bước 2 — Tạo app chính main-app
Mở terminal mới, quay về thư mục gốc mfe-workspace:
```
cd ..   # về lại mfe-workspace nếu đang ở trong blog-app
npx create-next-app@latest main-app
```
Chọn cấu hình tương tự bước 1 (TypeScript, App Router...).
```
cd main-app
```

#### 2.1 Sửa next.config.ts để rewrite sang blog-app
```
import type { NextConfig } from "next";

const BLOG_APP_URL = process.env.BLOG_APP_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: `${BLOG_APP_URL}/blog`,
      },
      {
        source: "/blog/:path*",
        destination: `${BLOG_APP_URL}/blog/:path*`,
      },
    ];
  },
};

export default nextConfig;
```
#### 2.2 package.json — main-app chạy port 3000 (mặc định, không cần sửa dev, nhưng nên ghi rõ)
```
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "eslint"
  }
}
```
#### 2.3 Sửa trang chủ app/page.tsx
```
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
```
<i>Lưu ý: dùng thẻ <a> thường, không dùng next/link, vì /blog thuộc router của app khác.</i>
#### 2.4 Tạo file môi trường (không bắt buộc ở local nhưng nên có sẵn)
Tạo file .env.local trong main-app:
```
BLOG_APP_URL=http://localhost:3001
```

### Bước 3 — Chạy đồng thời cả 2 app
Bạn cần 2 terminal chạy song song (blog-app phải chạy trước hoặc cùng lúc với main-app, vì main-app sẽ proxy request tới nó):

Terminal 1:
```
cd mfe-workspace/blog-app
npm run dev
# → chạy tại http://localhost:3001
```
Terminal 2:
```
cd mfe-workspace/main-app
npm run dev
# → chạy tại http://localhost:3000
```

### Bước 4 — Kiểm tra kết quả
- Mở http://localhost:3000 → thấy trang vàng "MAIN-APP"
- Bấm link "Đi tới Blog" hoặc gõ trực tiếp http://localhost:3000/blog → URL vẫn là port 3000, nhưng nội dung hiển thị là trang xanh của blog-app (request đã được main-app proxy sang port 3001 ở phía server, browser không biết)
- Thử http://localhost:3000/blog/hello-world → cũng phải ra đúng nội dung bài viết

Nếu bước 4 chạy đúng như vậy — bạn đã có một hệ thống Micro Frontend hoạt động thật trên local: 2 codebase độc lập, 2 process độc lập, nhưng hợp nhất thành 1 trải nghiệm domain duy nhất.

## Cấu trúc thư mục cuối cùng để đối chiếu
```
mfe-workspace/
├── blog-app/
│   ├── app/
│   │   ├── page.tsx
│   │   └── hello-world/page.tsx
│   ├── next.config.ts
│   └── package.json
└── main-app/
    ├── app/
    │   └── page.tsx
    ├── next.config.ts
    ├── .env.local
    └── package.json
```