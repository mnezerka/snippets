package main

import (
	"fmt"
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
    if len(os.Args) != 2 {
        fmt.Println("No image to be processed")
        return
    }

    if _, err := os.Stat(os.Args[1]); os.IsNotExist(err) {
        fmt.Println("No such file:", os.Args[1])
        return
    }

    if filepath.Ext(os.Args[1]) != ".png" {
        fmt.Println("Invalid image extension");
        return
    }

    var basename = filepath.Base(os.Args[1])
    var name = strings.TrimSuffix(basename, filepath.Ext(basename))
    var finalPath = filepath.Join(filepath.Dir(os.Args[1]), name + "_fix.png")

    processImage(os.Args[1], finalPath)
}

func processImage(pathFrom string, pathTo string) {
    fmt.Printf("Fixing %s -> %s\n", pathFrom, pathTo)

	// Decode the JPEG data.
	reader, err := os.Open(pathFrom)
	if err != nil {
		fmt.Println(err)
	}
	defer reader.Close()
	m, _, err := image.Decode(reader)
	if err != nil {
		fmt.Println(err)
	}

     bounds := m.Bounds()

    if bounds.Max.X != 3008 || bounds.Max.Y != 2000 {
        fmt.Println("Invalid image dimensions (%d, %d)", bounds.Max.X, bounds.Max.Y);
        return;
    }


	// make image writeable
	newImage := CloneToRGBA(m)

	fixLineError(newImage)

	// save image
	toimg, _ := os.Create(pathTo)
	defer toimg.Close()
	png.Encode(toimg, newImage)
}
