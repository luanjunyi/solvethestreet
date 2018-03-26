# -*- coding: utf-8 -*-

template = u'<div class="suit-combo" data-suit="%s">%s</div>'


spade = [u'<span class="suit">♠</span>', 's']
heart = [u'<span class="suit" style="color: red">♥</span>', 'h']
club = [u'<span class="suit">♣</span>', 'c']
diamond = [u'<span class="suit" style="color: red">♦</span>', 'd']

suits = [club, diamond, heart, spade]

print '------------------pair suits------------------------'

for i in xrange(len(suits)):
    for j in xrange(i+1, len(suits)):
        s1 = suits[i][1]
        s2 = suits[j][1]
        key = s1 + s2
        html = suits[i][0] + suits[j][0]
        output = template % (key, html)
        print output


print '------------------offsuit suits------------------------'

for i in xrange(len(suits)):
    for j in xrange(len(suits)):
        if i == j:
            continue
        s1 = suits[i][1]
        s2 = suits[j][1]
        key = s1 + s2
        html = suits[i][0] + suits[j][0]
        output = template % (key, html)
        print output
