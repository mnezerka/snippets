package main

import (
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"log"
	"os"

	"image/png"
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

	bounds := img.Bounds()
	fmt.Printf("Bounds: %#v\n", bounds)

	// fix line
	for y := lineY + 5; y < bounds.Max.Y; y++ {
		var left color.RGBA = img.At(lineX-1, y).(color.RGBA)
		var right color.RGBA = img.At(lineX+1, y).(color.RGBA)

		// simple interpolation
		img.Set(lineX, y, color.RGBA{(left.R + right.R) / 2, (left.G + right.G) / 2, (left.B + right.B) / 2, 255})

	}

	// fix point
	var left color.RGBA = img.At(lineX-dia, lineY).(color.RGBA)
	var right color.RGBA = img.At(lineX+dia, lineY).(color.RGBA)
	var top color.RGBA = img.At(lineX, lineY-dia).(color.RGBA)
	var bottom color.RGBA = img.At(lineX, lineY+dia).(color.RGBA)

	for x := lineX - dia; x <= lineX+dia; x++ {
		img.Set(x, lineY, color.RGBA{(left.R + right.R) / 2, (left.G + right.G) / 2, (left.B + right.B) / 2, 255})
	}

	for y := lineY - dia; y <= lineY+dia; y++ {
		img.Set(lineX, y, color.RGBA{(top.R + bottom.R) / 2, (top.G + bottom.G) / 2, (top.B + bottom.B) / 2, 255})
	}

	for x := lineX - dia2; x <= lineX+dia2; x++ {
		for y := lineY - dia2; y <= lineY+dia2; y++ {
			img.Set(x, y, color.RGBA{
				(left.R + right.R + top.R + bottom.R) / 4,
				(left.G + right.G + top.G + bottom.G) / 4,
				(left.B + right.B + top.B + bottom.B) / 4, 255})
		}
	}

}

func main() {
	// Decode the JPEG data.
	reader, err := os.Open("test.png")
	if err != nil {
		log.Fatal(err)
	}
	defer reader.Close()
	m, _, err := image.Decode(reader)
	if err != nil {
		log.Fatal(err)
	}

	// make image writeable
	newImage := CloneToRGBA(m)

	fixLineError(newImage)

	// save image
	toimg, _ := os.Create("test_out.png")
	defer toimg.Close()
	png.Encode(toimg, newImage)
}
