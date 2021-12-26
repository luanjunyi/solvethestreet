# Introduction

The tool is available for free at http://greenswan.pro/poker-range/.

This is the tool for NLTH players who actually understand GTO style and know how to improve the game using the theory. Yes, most players know about GTO but don't know exactly how to apply it. I'll write some posts explaining it in the future(maybe), but it's beyond the scope here.

This tool is inspired by [Doug Polk](https://www.facebook.com/DougPolkPoker/). During his most recent video, he taught the audience about [how to study the game](https://www.youtube.com/watch?v=QzF2YPCPZMM). This vedio mentioned how to think and study poker off table. I highly recommend you watch the vedio. The method Doug illustrated is the core of improving your game.

However, he and many other coaches had been using EquityLab for the work. It's really hard since EquityLab is not desiged for hand range analysis. I did some research and found that there's no free and decent tool for this task. So I built this one for you.

# How to use

The best way is to illustrate with an example hand I played the other day.

Everyone is over 300bb deep. Hero is dealt KdJd at CO. LoJ opened 4bb and hero 3bet to 14bb. Only LoJ called.

Flop(28bb) is 3cJs4d. Loj check, hero bet 14bb. LoJ called.
Turn(56bb) is Qs. Check check.
River(56bb) is 7s. Loj check. Hero bet 37bb. Loj check raise to 200bb. What should hero do?

Let me illustrate how to use this tool for analysis.

First we should determine our range in flop.

## Select dead card

By input dead card in the textbox with forms like **3c,Js,4d** and press enter, the dead card will be loaded in the image area below. This card will be reflected in the combo numbers in other parts of the system.

You can also press **random** to generate a board for your practice.

## Select and assign ranges

It works like EquityLab. To select suits, click **Split Suit** button. Please make sure your current selection contains only one catetories of the three(suited hands, offsuit hands and pocket pair). When you are happy, select the right range and click **Assign** button. The combo number will be displayed.

Four ranges are supported

- Fold/Check
- Call
- Bluff
- Value bet/Raise

You can use it for different scenarios. For our case, my range OTF is like below.

![Flop example](https://raw.githubusercontent.com/luanjunyi/solvethestreet/master/example/flop.png)

Here, I check back (2/3) of my top sets because it blocked villian's call range and is least vulnerable hand. There should be 1.2-2.0 bluff combos for every value combo. Here we have 28 value combos and actually need to bluff all my hands unless it's marginal made hands.

OTT, I will choose to check KJs and AJs to control the pot. Since AQ, KQ became top pair and we need roughly 1:1 for values :bluffs ratio, we need to barrel all bluff combos from the flop. Here all our bluff has consierable equity, even they didn't, we still need to bluff them for a balanced range. My turn range is at below.

![Turn example](https://raw.githubusercontent.com/luanjunyi/solvethestreet/master/example/turn.png)

The river's 7c only completed 56, so I decided to bet my AJs and KJs. Notice they are the only two hands I have on this BXB line. There are 6 combos. The XR from villian will fold around 69%(200/(200+56+37)=0.69) of my hands. So I need to defend with 6 * 0.3 = 1.8 combos. Here KJ is a clear fold as I will pick only two AJs. I think bloker is neutrual for AJ and KJ in this case.

Above is an full example of hand analysis. Of course you can use it for only one street. 

## Save ranges

You can click **Ranges** to pull the range manipulation pop up. There you can save and load your ranges. The ranges are arranged in folders. Play with them and you will understand. I put all my preflop ranges there so I can quickly load them for different boards.

![Range example](https://raw.githubusercontent.com/luanjunyi/solvethestreet/master/example/range.png)

## Persistent your data

The data is stored in your browser's [local storage](https://en.wikipedia.org/wiki/Web_storage#localStorage). They will be there as long as you are using the same browser from the same computer. It's fine to close the browser, update it or close/update the computer, data will still be there. If you wanna backup or carry the ranges you saved to other comupters, click the 'Export/Import Data to computer' button and the necessary controls will show up. Then click download button and save your exported data. I recommend saving them to Dropbox.

You can restore your data in new browser/computer by selecting the json file and click import.

I didn't store data in server to simplify the design and out of the respect of your data.




