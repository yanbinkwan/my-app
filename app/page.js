"use client";

import OpenSeadragon from "openseadragon";
import * as Annotorious from "@recogito/annotorious-openseadragon";
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";
import SelectorPack from "@recogito/annotorious-selector-pack";
import Tool from "@recogito/annotorious-toolbar/src/index";
import { useEffect } from "react";
import html2canvas from "html2canvas";
import GEO from "./GeoTIFFTileSource.js";

export default function Home() {
  useEffect(() => {
    const viewer = OpenSeadragon({
      id: "dragon-container",
      showNavigator: true
      // tileSources: "/files/test.dzi"
    });
    const config = { allowEmpty: true }; // Optional plugin config options

    const anno = Annotorious(viewer, config);
    GEO(OpenSeadragon);

    let tiffTileSources = OpenSeadragon.GeoTIFFTileSource.getAllTileSources(
      "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif",
      { logLatency: true }
    );
    tiffTileSources.then(ts => viewer.open(ts));

    SelectorPack(anno, {});
    const toolNames = anno.listDrawingTools();
    Tool(anno, document.getElementById("my-toolbar-container"));
    anno.setDrawingTool(toolNames[0]);
    anno.setDrawingEnabled(true);
  }, []);

  const handleClick = () => {
    html2canvas(document.querySelector("#dragon-container")).then(canvas => {
      var link = document.createElement("a");
      link.download = "filename.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <main className='h-full'>
      <button onClick={handleClick}>capture</button>
      <div id='my-toolbar-container'></div>
      <div id='dragon-container' className='w-full h-[40rem]'></div>
    </main>
  );
}
