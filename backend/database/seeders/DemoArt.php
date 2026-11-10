<?php

namespace Database\Seeders;

/**
 * Pembuat gambar demo memakai GD supaya proyek bisa di-seed tanpa internet.
 * Hasilnya gambar abstrak bergaya poster, bukan foto asli.
 */
class DemoArt
{
    private const PALETTES = [
        [[247, 236, 220], [216, 122, 86], [59, 63, 82]],
        [[233, 238, 231], [126, 152, 128], [44, 52, 46]],
        [[250, 232, 236], [199, 111, 134], [72, 48, 62]],
        [[232, 238, 245], [108, 132, 158], [38, 47, 60]],
        [[251, 244, 226], [214, 176, 106], [74, 60, 40]],
        [[240, 234, 246], [150, 128, 178], [53, 44, 66]],
        [[246, 238, 228], [183, 121, 92], [56, 46, 38]],
        [[229, 244, 243], [92, 154, 152], [30, 56, 55]],
        [[252, 240, 230], [226, 148, 116], [70, 52, 42]],
        [[236, 233, 222], [140, 143, 108], [44, 46, 36]],
    ];

    public static function photo(string $absolutePath, int $seed): void
    {
        [$light, $accent, $dark] = self::PALETTES[$seed % count(self::PALETTES)];
        $w = 1000;
        $h = 1250;
        $img = imagecreatetruecolor($w, $h);
        imageantialias($img, true);

        self::gradient($img, $w, $h, $light, $accent, $seed);
        mt_srand($seed * 7919);

        // Bentuk besar
        $shapeColor = imagecolorallocatealpha($img, $dark[0], $dark[1], $dark[2], 95);
        $softColor = imagecolorallocatealpha($img, $light[0], $light[1], $light[2], 70);
        $accentColor = imagecolorallocatealpha($img, $accent[0], $accent[1], $accent[2], 25);

        $variant = $seed % 4;

        if ($variant === 0) {
            imagefilledellipse($img, (int) ($w * 0.5), (int) ($h * 0.42), (int) ($w * 0.72), (int) ($w * 0.72), $shapeColor);
            imagefilledellipse($img, (int) ($w * 0.22), (int) ($h * 0.74), (int) ($w * 0.3), (int) ($w * 0.3), $softColor);
        } elseif ($variant === 1) {
            imagefilledrectangle($img, (int) ($w * 0.12), (int) ($h * 0.28), (int) ($w * 0.88), (int) ($h * 0.62), $shapeColor);
            for ($i = 0; $i < 7; $i++) {
                imagesetthickness($img, 3);
                $y = (int) ($h * 0.2 + $i * $h * 0.09);
                imageline($img, (int) ($w * 0.1), $y, (int) ($w * 0.9), $y - 40, $softColor);
            }
        } elseif ($variant === 2) {
            imagefilledarc($img, (int) ($w * 0.5), (int) ($h * 0.55), (int) ($w * 1.1), (int) ($w * 1.1), 200, 340, $shapeColor, IMG_ARC_PIE);
            imagefilledellipse($img, (int) ($w * 0.7), (int) ($h * 0.24), 220, 220, $softColor);
        } else {
            imagefilledpolygon($img, [
                0, (int) ($h * 0.85),
                (int) ($w * 0.45), (int) ($h * 0.3),
                (int) ($w), (int) ($h * 0.9),
            ], $shapeColor);
            imagefilledellipse($img, (int) ($w * 0.28), (int) ($h * 0.26), 260, 260, $accentColor);
        }

        // Garis tepi & bingkai poster
        imagesetthickness($img, 2);
        imagerectangle($img, 60, 60, $w - 60, $h - 60, imagecolorallocatealpha($img, $dark[0], $dark[1], $dark[2], 60));

        // Butiran halus
        for ($i = 0; $i < 2600; $i++) {
            $x = mt_rand(0, $w - 1);
            $y = mt_rand(0, $h - 1);
            $alpha = mt_rand(85, 118);
            $c = imagecolorallocatealpha($img, mt_rand(0, 255), mt_rand(0, 255), mt_rand(0, 255), $alpha);
            imagesetpixel($img, $x, $y, $c);
        }

        // Vignette sederhana
        for ($i = 0; $i < 90; $i++) {
            $alpha = 110 - (int) ($i * 0.9);
            $c = imagecolorallocatealpha($img, $dark[0], $dark[1], $dark[2], max(0, $alpha));
            imagerectangle($img, $i, $i, $w - $i, $h - $i, $c);
        }

        self::ensureDir(dirname($absolutePath));
        imagejpeg($img, $absolutePath, 82);
        imagedestroy($img);
    }

    public static function avatar(string $absolutePath, int $seed): void
    {
        [$light, $accent, $dark] = self::PALETTES[$seed % count(self::PALETTES)];
        $s = 400;
        $img = imagecreatetruecolor($s, $s);
        imageantialias($img, true);
        mt_srand($seed * 104729);

        for ($y = 0; $y < $s; $y++) {
            $t = $y / $s;
            [$r, $g, $b] = self::mix($accent, $dark, $t);
            $line = imagecolorallocate($img, $r, $g, $b);
            imageline($img, 0, $y, $s, $y, $line);
        }

        $soft = imagecolorallocatealpha($img, $light[0], $light[1], $light[2], 60);
        imagefilledellipse($img, (int) ($s * 0.5), (int) ($s * 0.42), 250, 250, $soft);
        imagesetthickness($img, 6);
        imagearc($img, (int) ($s * 0.5), (int) ($s * 0.52), 330, 330, 200, 340, imagecolorallocatealpha($img, $light[0], $light[1], $light[2], 35));

        for ($i = 0; $i < 400; $i++) {
            $c = imagecolorallocatealpha($img, mt_rand(0, 255), mt_rand(0, 255), mt_rand(0, 255), mt_rand(90, 120));
            imagesetpixel($img, mt_rand(0, $s - 1), mt_rand(0, $s - 1), $c);
        }

        self::ensureDir(dirname($absolutePath));
        imagejpeg($img, $absolutePath, 85);
        imagedestroy($img);
    }

    private static function gradient($img, int $w, int $h, array $from, array $to, int $seed): void
    {
        for ($y = 0; $y < $h; $y++) {
            $t = $y / $h;
            // gelombang lembut agar tidak terlihat seperti gradient datar
            $t = min(1, max(0, $t + sin($y / 120 + $seed) * 0.06));
            [$r, $g, $b] = self::mix($from, $to, $t);
            $line = imagecolorallocate($img, $r, $g, $b);
            imageline($img, 0, $y, $w, $y, $line);
        }
    }

    private static function mix(array $a, array $b, float $t): array
    {
        return [
            (int) round($a[0] + ($b[0] - $a[0]) * $t),
            (int) round($a[1] + ($b[1] - $a[1]) * $t),
            (int) round($a[2] + ($b[2] - $a[2]) * $t),
        ];
    }

    private static function ensureDir(string $dir): void
    {
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }
}
