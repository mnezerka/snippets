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
            fmt.Println("Invalid file format:", fileExt);
            continue
        }

        image := loadImage(filePath)

        fmt.Printf("Fixing %s -> %s ... ", fileName, fileNameFix)

        if imageFix, err := processImage(image); err == nil {
            saveImage(imageFix, filePathFix)
            fmt.Printf("done.\n")
        } else {
            fmt.Println(err)
        }

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

func saveImage(image *draw.Image, path string) {
	toimg, _ := os.Create(path)
	defer toimg.Close()
	png.Encode(toimg, *image)
}

// 1 - horizontal , 2- vertical_90, 3 - vertical_270
func detectOrientation(image *draw.Image) int {

    bounds := (*image).Bounds()

    // 0 - wrong, 1 - horizontal , 2- vertical
    orientation := 0

    if (bounds.Max.X == 3008 || bounds.Max.Y == 2000) {
        orientation = 1
    } else if (bounds.Max.Y == 3008 || bounds.Max.X == 2000) {
        // implementation of detection
        orientation = 2
    }

    return orientation
}


func processImage(image *image.Image) (*draw.Image, error) {

	// make image writeable
	newImage := CloneToRGBA(*image)

    var err error

    err = fixLineError(&newImage)

    return &newImage, err
}

func CloneToRGBA(src image.Image) draw.Image {
	b := src.Bounds()
	dst := image.NewRGBA(b)
	draw.Draw(dst, b, src, b.Min, draw.Src)
	return dst
}

func fixLineError(image *draw.Image) error {
	const lineX = 1572
	const lineY = 1451
	const dia = 4
    const shiftX = 10
    const shiftY = 0

    bounds := (*image).Bounds()

    // 0 - wrong image format, 1 - horizontal , 2- vertical
    orientation := detectOrientation(image)

    if (orientation == 0) {
        return fmt.Errorf("Invalid image dimensions (%d, %d)", bounds.Max.X, bounds.Max.Y);
    }

    // detect left/right in case of vertical orientation
    if (orientation == 2) {
        var diffLeft = 0
        var diffRight = 0
        var tryLeft color.RGBA = (*image).At(lineY, bounds.Max.Y - lineX).(color.RGBA)
        var tryRight color.RGBA = (*image).At(bounds.Max.X - lineY, lineX).(color.RGBA)

        for i := 0; i < 3; i++ {
            tryLeft color.RGBA = (*image).At(lineY + i, bounds.Max.Y - lineX).(color.RGBA)
            tryRight color.RGBA = (*image).At(bounds.Max.X - lineY - i, lineX).(color.RGBA)
            
            fmt.Println(i, tryLeft);
            fmt.Println(i, tryRight);
        }
    }

	// fix line
	for y := lineY + 5; y < bounds.Max.Y; y++ {
		var left color.RGBA = (*image).At(lineX-1, y).(color.RGBA)
		var right color.RGBA = (*image).At(lineX+1, y).(color.RGBA)

		// simple interpolation
		(*image).Set(lineX, y, color.RGBA{(left.R + right.R) / 2, (left.G + right.G) / 2, (left.B + right.B) / 2, 255})
	}

    // fix point
	for x := lineX - dia; x <= lineX + dia; x++ {
		for y := lineY - dia; y <= lineY + dia; y++ {
            var src color.RGBA = (*image).At(x + shiftX, y + shiftY).(color.RGBA)
            (*image).Set(x, y, color.RGBA{src.R, src.G, src.B, 255})
        }
    }

    return nil
}

