# مَصروف — مصدر فيديو الإعلان (Promo Source)
ملفات توليد البرومو (نسخة دارك) — جاهزة للتعديل على الكمبيوتر.

## المتطلبات
```
pip install pillow numpy imageio-ffmpeg arabic-reshaper python-bidi
```
خطوط Tajawal مطلوبة في `/tmp/fonts/` (Tajawal-Regular/Bold/ExtraBold/Black.ttf).
حمّلها من: https://github.com/google/fonts/tree/main/ofl/tajawal
أو عدّل المسار `F="/tmp/fonts/Tajawal-%s.ttf"` في screens.py و build_video.py.

## الملفات
- `screens.py` — يرسم شاشات التطبيق (الرئيسية، الإضافة، الاشتراكات، التقارير، الإعدادات) + الأيقونات والألوان.
- `build_video.py` — يبني الفيديو: جولة على الشاشات + عرض تفاعلي حي لإجراء الزواج، داخل إطار جوال. (المتغيّر `K` يتحكم بسرعة العرض التفاعلي).
- `build_audio.py` — يولّد الموسيقى + الأصوات التفاعلية (نقرات/whoosh/رنّات) المتزامنة.

## التوليد
```
python3 build_video.py        # ينتج /tmp/promo4b_silent.mp4
python3 build_audio.py        # ينتج /tmp/promo4b_audio.wav
ffmpeg -y -i /tmp/promo4b_silent.mp4 -i /tmp/promo4b_audio.wav -c:v copy -c:a aac -shortest masrouf-promo-dark.mp4
```

## ملاحظات للتعديل
- الألوان والهوية في أعلى `screens.py` (PUR/BLU/RED/GLD/GRN…).
- مدّة وترتيب المشاهد في `TIMELINE` داخل `build_video.py`.
- خطوات العرض التفاعلي في `P` و `WP` و `TAPS` و `demo_frame`.
- لتبطئة/تسريع العرض التفاعلي فقط: غيّر `K` (الحالي 1.4).
- القياس 1080×1920 (9:16) — مناسب تيك توك/إنستقرام.
