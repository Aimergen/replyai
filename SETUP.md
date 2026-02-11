# 🚀 AutoReply.mn - Бүрэн Setup Заавар

## 📋 Хэрэгтэй зүйлс

1. Facebook Developer Account
2. Supabase Account
3. Next.js 16 project (✅ аль хэдийн байна)

---

## 🔧 Алхам 1: Facebook App Үүсгэх

### 1.1. Facebook App үүсгэх

1. https://developers.facebook.com руу орно
2. **"My Apps"** → **"Create App"**
3. **"Business"** сонгоно
4. Мэдээллээ оруулна:
   - Display Name: `AutoReply.mn`
   - App Contact Email: таны email
   - Business Account: (хэрэв байвал)

### 1.2. Facebook Login тохируулах

1. Dashboard → **"Facebook Login for Business"** → **"Set Up"**
2. **Settings** руу орно
3. **Valid OAuth Redirect URIs** нэмнэ:

```
http://localhost:3000/auth/facebook-callback
https://yourdomain.com/auth/facebook-callback
```

4. **Save Changes**

### 1.3. Permissions авах

1. **App Review** → **Permissions and Features**
2. Дараах permissions хүсэх:
   - ✅ `pages_show_list`
   - ✅ `pages_read_engagement`
   - ✅ `pages_manage_engagement` (⭐ Энэ чухал!)
   - ✅ `pages_manage_metadata`
   - ✅ `pages_read_user_content`

3. **Submit for Review** дарж, дэлгэрэнгүй тайлбар + video demo илгээнэ

**⚠️ Анхаар**: Review 3-7 хоног үргэлжилнэ. Тест хийх үед Development Mode-д байвал өөрийн page дээр ажиллана.

---

## 🗄️ Алхам 2: Supabase Database Тохируулах

### 2.1. Supabase дээр schema үүсгэх

1. Supabase Dashboard → **SQL Editor**
2. `database-schema.sql` файлын агуулгыг хуулаад ажиллуулна
3. Бүх table үүсэх:
   - `profiles`
   - `user_facebook_pages`
   - `reply_rules`
   - `reply_logs`

### 2.2. Facebook Auth идэвхжүүлэх

1. **Authentication** → **Providers**
2. **Facebook** сонгоно
3. Дараах мэдээллүүдийг оруулна:
   - **Facebook Client ID**: (Facebook App-аас авна)
   - **Facebook Client Secret**: (Facebook App-аас авна)
   - **Authorize redirect URL**: `https://your-project.supabase.co/auth/v1/callback`

4. **Save**

---

## 🔐 Алхам 3: Environment Variables

### 3.1. `.env.local` файл үүсгэх

Төслийнхөө root directory-д:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Facebook App
NEXT_PUBLIC_FACEBOOK_APP_ID=1234567890123456
NEXT_PUBLIC_FACEBOOK_APP_SECRET=abcdef1234567890abcdef1234567890
FACEBOOK_VERIFY_TOKEN=my_custom_secret_verify_token_xyz

# Веб app URL (production дээр солих)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2. Facebook credentials хаанаас авах?

1. **Facebook App Dashboard** → **Settings** → **Basic**
2. **App ID** → Copy
3. **App Secret** → **Show** → Copy

---

## 🔔 Алхам 4: Webhook Тохируулах

### 4.1. Ngrok ашиглах (local тест хийхдээ)

```bash
# Ngrok суулгах
brew install ngrok  # MacOS
# эсвэл https://ngrok.com/download

# Ngrok эхлүүлэх
ngrok http 3000
```

**Гаралт**:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3000
```

### 4.2. Facebook Webhooks тохируулах

1. **Facebook App Dashboard** → **Add Product** → **Webhooks**
2. **Page** сонгоно
3. **"Subscribe to this object"** дарна
4. Дараах мэдээллүүдийг оруулна:
   - **Callback URL**: `https://abc123.ngrok-free.app/api/facebook-webhook`
   - **Verify Token**: `.env.local` дахь `FACEBOOK_VERIFY_TOKEN` утга
5. **Verify and Save**
6. **Subscription Fields** сонгох:
   - ✅ `feed`
   - ✅ `comments`

---

## 🧪 Алхам 5: Тест Хийх

### 5.1. Development mode-д тест

```bash
# Terminal 1: Next.js эхлүүлэх
npm run dev

# Terminal 2: Ngrok эхлүүлэх
ngrok http 3000
```

### 5.2. Тестийн алхмууд

1. **http://localhost:3000** руу орно
2. **"Google-р нэвтрэх"** эсвэл **"Facebook-ээр нэвтрэх"** дарна
3. Facebook Page сонгоно
4. Dashboard-руу шилжинэ
5. **"Дүрэм нэмэх"** дарж keyword + reply нэмнэ
6. Facebook Page дээрээ post үүсгэнэ
7. Comment бичнэ (keyword ашиглаад)
8. Автомат хариулт ирнэ! 🎉

### 5.3. Logs шалгах

```bash
# Terminal дээрх logs харах
# Server:
✅ Webhook verified successfully
💬 Шинэ comment олдлоо:
  Comment ID: 123456789
  Message: Энэ бараа хэд вэ?
✅ Keyword олдлоо: үнэ
✅ Reply амжилттай илгээлээ: 987654321
```

---

## 🚨 Түгээмэл Алдаа & Шийдэл

### Алдаа 1: `No provider_token found`
**Шалтгаан**: Facebook OAuth тохиргоо буруу
**Шийдэл**: 
- Supabase дээр Facebook provider зөв тохируулсан эсэхийг шалга
- `scopes` зөв байгаа эсэхийг шалга

### Алдаа 2: `Webhook verification failed`
**Шалтгаан**: Verify token таарахгүй байна
**Шийдэл**:
- `.env.local` дахь `FACEBOOK_VERIFY_TOKEN` утга
- Facebook Webhooks дээрх **Verify Token**
- Хоёулаа яг ижил байх ёстой

### Алдаа 3: `Page token expired`
**Шалтгаан**: Short-lived token ашигласан
**Шийдэл**:
- `facebook-callback-fixed.tsx` код ашиглах (long-lived token авдаг)

### Алдаа 4: Comment-д хариулж чадахгүй
**Шалтгаан**: `pages_manage_engagement` permission байхгүй
**Шийдэл**:
- Facebook App Review-д `pages_manage_engagement` хүсэх
- Development mode-д өөрийн page дээр тест хийх

---

## 📦 Production Deployment

### 1. Vercel дээр deploy хийх

```bash
vercel
```

### 2. Environment Variables нэмэх

Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_FACEBOOK_APP_ID`
- `NEXT_PUBLIC_FACEBOOK_APP_SECRET`
- `FACEBOOK_VERIFY_TOKEN`

### 3. Facebook App Settings шинэчлэх

**Valid OAuth Redirect URIs**:
```
https://yourdomain.com/auth/facebook-callback
```

**Webhook Callback URL**:
```
https://yourdomain.com/api/facebook-webhook
```

---

## ✅ Checklist

- [ ] Facebook App үүсгэсэн
- [ ] Facebook Login тохируулсан
- [ ] Permissions хүссэн (эсвэл Review-д байна)
- [ ] Supabase database schema үүсгэсэн
- [ ] Facebook auth provider Supabase дээр идэвхжүүлсэн
- [ ] `.env.local` файл үүсгэж, бүх credentials оруулсан
- [ ] Webhooks тохируулсан
- [ ] Ngrok ашиглан local тест хийсэн
- [ ] Comment-д автомат хариулт амжилттай ажиллаж байна

---

## 🎯 Дараагийн алхмууд

1. **AI Integration**: OpenAI/Claude API ашиглаад илүү ухаалаг хариулт үүсгэх
2. **Analytics**: Comment тоо, хариулт тоо харуулах dashboard
3. **Multi-language**: Англи, Монгол хэл аль алинд нь ажиллах
4. **Scheduling**: Өдөр тутмын тайлан илгээх
5. **Payment**: Stripe/QPay холбох

---

## 📞 Тусламж хэрэгтэй бол

- Facebook Developer Docs: https://developers.facebook.com/docs/
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

Амжилт хүсье! 🚀
