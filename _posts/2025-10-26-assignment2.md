---
layout: post
title: 'Assignment 2 - Redesign a Notable Information Graphic'
author: 'Wan-Ting Chang'
categories: documentation
tags: [documentation, sample]
image: 3dchart.png
date: 2025-10-26
---

## Introduction

For this assignment, we were given 3 notable information graphics and asked to redesign one of them using contemporary interactive methods. These graphics are Snow's cholera map, Minard's Russian campaign and Nightingale's coxcomb. I chose Florence Nightingale's coxcomb diagram because it's quite confusing for me, actually. As a visual person, I can see numerous opportunities for improvement. Here is my analysis of the improvements for this diagram:

## Problem 1: Pie Chart Confusion

It looks a lot like a pie chart to me, which has been less favored among the data visualization community due to lack of clarity for comparison of each data in each pie.

![Pie chart comparison]({{ '/assets/img/piecharts.png' | relative_url }})

_Screenshot from: [https://en.wikipedia.org/wiki/Pie_chart](https://en.wikipedia.org/wiki/Pie_chart)_

## Problem 2: Inconsistent Sizes

The two years are in different sizes, it's hard to tell which month has the higher death count.

![Nightingale's original coxcomb diagram showing inconsistent sizes]({{ '/assets/img/Nightingale-mortality.webp' | relative_url }})

**Issue:** Year 1854 and 1855 are visualized at different scales, making temporal comparisons difficult and potentially misleading.

## Problem 3: Overlapping Area Confusion

It is unclear whether the colored segments in Nightingale's diagram overlap with one another. According to descriptions, all areas are measured from the center, which would make it impossible to represent the total number of deaths for each month accurately. If the colors were instead drawn with an overlapping effect, the overall mortality for each month would be more clearly visualized. On the other hand, if the segments do not overlap, the total number of deaths becomes easier to interpret, but it can be challenging to distinguish the relative proportions of each cause of death within a given month.

![Nightingale's original coxcomb diagram showing confusing overlap]({{ '/assets/img/Nightingale-mortality1.jpg' | relative_url }})

**Clarity Issue:** The radial design makes it challenging to distinguish between different causes of death and understand proportional relationships.

## Initial Ideas: Jenga Blocks

So I started to write down ideas in my notebook. At first, I was thinking to use Jenga blocks to recreate something similar to the coxcomb but maybe more like a sun burst chart. But then realized that Jenga blocks have their own limitations. For example, I couldn't cut it to make it proportionally correspond to the data.

![Initial notebook ideas]({{ '/assets/img/IMG_2115.jpeg' | relative_url }})

## Enter Play-Doh

However, I still wanted to explore this idea. I went to Walmart to look for Jenga blocks, but I didn't find any. Instead, I came across a shelf full of Play-Doh, which gave me a better idea — why not use Play-Doh? It's more flexible and easier to divide into portions. I drew inspiration from [Amy Cesal's daily Play-Doh data visualizations](https://www.amycesal.com/daydohviz), which showcase creative data storytelling using tactile materials.

![Play-Doh exploration 1]({{ '/assets/img/IMG_2108.jpeg' | relative_url }})

![Play-Doh exploration 2]({{ '/assets/img/IMG_2111.jpeg' | relative_url }})

![Play-Doh visualization]({{ '/assets/img/IMG_2113.jpeg' | relative_url }})

**Innovation:** Play-Doh offers the tactile, proportional visualization I was seeking while being more adaptable than solid blocks.

**Pros:** Tangible, easy to manipulate, easy to divide into portions, easy to play with, can stack them up to see the total number of deaths, and easy to explain to others, especially children.

**Cons:** Not sustainable, not reusable, time consuming and labor intensive to make it, not very efficient.

## Exploring Digital Alternatives

I jot down more ideas.

**Maybe a 3D bar chart**

![3D bar chart concept]({{ '/assets/img/IMG_2116.jpeg' | relative_url }})

**Or a 2D Calendar-like Bar Chart**

I got some inspiration from [Giorgia Lupi's long covid visualization](https://www.nytimes.com/interactive/2023/12/14/opinion/my-life-with-long-covid.html).

![Calendar type bar chart concept]({{ '/assets/img/IMG_2117.jpeg' | relative_url }})

## Contemporary Tools

I started to use contemporary tools to explore and develop the final two ideas.

### I used Figma to create the calendar type chart

![Figma calendar chart]({{ '/assets/img/figma1.png' | relative_url }})

### Color Temperature Visualization

Change the color tones based on the month's warmth or coldness

![Color temperature adjustments]({{ '/assets/img/figma2.png' | relative_url }})

Then I asked Cursor to generate the 3D bar chart for me

![Screenshot of Cursor generating the 3D bar chart]({{ '/assets/img/cursor.png' | relative_url }})

**Technology:** Using AI-powered code generation to create interactive 3D visualizations with Three.js

## Final Decision

**I think I like the 3D bar chart the best.**

Because you can interact with it, hover to see the bar indicating the number of deaths. There is even a total death bar that you can see the significance of how disease plays an important role in it.

![3D Bar Chart Visualization]({{ '/assets/img/3dchart.png' | relative_url }})

From the screenshot above, we can clearly see that the total death has a very high correlation with the disease death. This is a powerful insight that makes the visualization more persuasive. It tells the government that this is preventable - the soldiers are not dying because of the war, they are dying because of the diseases, so please send in sanitizing team to help them.

<div style="width: 100%; height: 600px; margin: 40px 0; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); border: 2px solid #e0e0e0;">
    <iframe src="https://kiya69.github.io/mjtads/assets/assignments/visualization_storytelling/assignment2/web/" style="width: 100%; height: 100%; border: none;" title="3D Interactive Visualization"></iframe>
</div>

<div style="text-align: center; margin-top: 20px;">
    <a href="https://kiya69.github.io/mjtads/assets/assignments/visualization_storytelling/assignment2/web/" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #3b9797 0%, #16476a 100%); color: white; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 1.2rem; box-shadow: 0 5px 20px rgba(0,0,0,0.2);">View Full Screen →</a>
</div>
