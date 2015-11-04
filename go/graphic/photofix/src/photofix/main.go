package main

import (
	"fmt"
    _ "golang.org/x/image/tiff"
	"image"
	"image/color"
	"image/draw"
	"image/png"
    "path/filepath"
    "strings"
	"os"
)

func CloneToRGBA(src image.Image) draw.Image {
	b := src.Bounds()
	dst := image.NewRGBA(b)
	draw.Draw(dst, b, src, b.Min, draw.Src)
	return dst
}

func fixLineError(img draw.Image) {
	const lineX = 1572
	const lineY = 1451
	const dia = 4
	const dia2 = 1
    const shiftX = 10
    const shiftY = 0

	bounds := img.Bounds()

	// fix line
	for y := lineY + 5; y < bounds.Max.Y; y++ {
		var left color.RGBA = img.At(lineX-1, y).(color.RGBA)
		var right color.RGBA = img.At(lineX+1, y).(color.RGBA)

		// simple interpolation
		img.Set(lineX, y, color.RGBA{(left.R + right.R) / 2, (left.G + right.G) / 2, (left.B + right.B) / 2, 255})
	}

    // fix point
	for x := lineX - dia; x <= lineX + dia; x++ {
		for y := lineY - dia; y <= lineY + dia; y++ {
            var src color.RGBA = img.At(x + shiftX, y + shiftY).(color.RGBA)
            img.Set(x, y, color.RGBA{src.R, src.G, src.B, 255})
        }
    }
}

func main() {
    if len(os.Args) < 2 {
        fmt.Println("No images to be processed")
        return
    }

    for i := 1; i < len(os.Args); i++ {
        filePath := os.Args[i]

        if _, err := os.Stat(filePath); os.IsNotExist(err) {
            fmt.Println("No such file:", filePath)
            continue
        }

        var fileName = filepath.Base(filePath)
        var fileExt = filepath.Ext(fileName)
        var fileNameRaw= strings.TrimSuffix(fileName, fileExt)
        var fileNameFix = fileNameRaw + "_fix.png"
        var filePathFix = filepath.Join(filepath.Dir(filePath), fileNameFix)

        if fileExt != ".tif" && fileExt != ".tiff" && fileExt != ".png" {
            fmt.Println("Invalid file format", fileExt);
            return
        }

        image := loadImage(filePath)

        fmt.Printf("Fixing %s -> %s ... ", fileName, fileNameFix)

        processImage(image)

        saveImage(image, filePathFix)

        fmt.Printf("done.\n")
    }
}

func loadImage(path string) *image.Image {
	reader, err := os.Open(path)
	if err != nil {
		fmt.Println(err)
	}
	defer reader.Close()
	m, _, err := image.Decode(reader)
	if err != nil {
		fmt.Println(err)
	}
    return &m
}

func saveImage(image *image.Image, path string) {
	toimg, _ := os.Create(path)
	defer toimg.Close()
	png.Encode(toimg, *image)
}

func processImage(image *image.Image) (*draw.Image, error) {

    bounds := (*image).Bounds()

    if bounds.Max.X != 3008 || bounds.Max.Y != 2000 {
        fmt.Println("Invalid image dimensions (%d, %d)", bounds.Max.X, bounds.Max.Y);
        return nil, fmt.Errorf("Invalid image dimensions (%d, %d)", bounds.Max.X, bounds.Max.Y);

    }

	// make image writeable
	newImage := CloneToRGBA(*image)

	fixLineError(newImage)

    return &newImage, nil
}
