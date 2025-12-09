# Daryn V2

Мұғалімдерге арналған AI көмекші платформасы - Сабақ жоспарлары, жұмыс парақтары және олимпиада тапсырмалары.

## Технологиялар

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **OpenAI API**

## Орнату

1. Тәуелділіктерді орнатыңыз:
```bash
npm install
```

2. Жергілікті орта айнымалысын орнатыңыз:
```bash
cp .env.example .env.local
```

`.env.local` файлына:
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini  # (міндетті емес)
```

3. Дәйексөз серверін іске қосыңыз:
```bash
npm run dev
```

Браузерде [http://localhost:3000](http://localhost:3000) ашыңыз.

## Vercel-ға деплой

1. GitHub репозиторийіне кодты жіберіңіз
2. [Vercel](https://vercel.com) сайтына кіріңіз
3. Жобаны импорттаңыз
4. Environment variables қосыңыз:
   - `OPENAI_API_KEY`: OpenAI API кілті
   - `OPENAI_MODEL`: (міндетті емес) Модель атауы

## Билд

```bash
npm run build
npm start
```

## Линтинг

```bash
npm run lint
```
