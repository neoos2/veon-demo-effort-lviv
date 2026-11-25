# Usage: python pliant-kern-fix.py <Pliant[wdth,wght].ttf> <out.ttf>  (needs fonttools)
# Adds Cyrillic у kerning pairs missing in Pliant (Latin y has them). Extra lookup appended to the 'kern' feature.
import sys, importlib.util
from fontTools.ttLib import TTFont
from fontTools.otlLib.builder import buildPairPosGlyphsSubtable, buildLookup, buildValue

src,out=sys.argv[1],sys.argv[2]
f=TTFont(src); cm=f.getBestCmap(); gp=f['GPOS'].table

def kern(a,b):
    tot=0
    for li in gp.FeatureList.FeatureRecord[0].Feature.LookupListIndex:
        l=gp.LookupList.Lookup[li]
        for st in l.SubTable:
            if l.LookupType==9: st=st.ExtSubTable
            if st.LookupType!=2: continue
            cov=st.Coverage.glyphs
            if a not in cov: continue
            if st.Format==1:
                for pv in st.PairSet[cov.index(a)].PairValueRecord:
                    if pv.SecondGlyph==b and pv.Value1: tot+=getattr(pv.Value1,'XAdvance',0) or 0
            else:
                r=st.Class1Record[st.ClassDef1.classDefs.get(a,0)].Class2Record[st.ClassDef2.classDefs.get(b,0)]
                if r.Value1: tot+=getattr(r.Value1,'XAdvance',0) or 0
    return tot
u=cm[0x443]
before={'в':-50,'г':-20,'д':-40,'ж':-60,'з':-40,'и':-50,'н':-50,'т':-30,'ц':-40,'щ':-40,'і':-40,'ї':-40,'ґ':-20,'к':-50,'п':-50,'ш':-50,'м':-50}
after={'д':-70,'л':-60,'я':-40,'з':-30,'ч':-30,'ж':-30,'к':-20,'н':-30,'п':-30,'м':-30}
pairs={}
for c,t in before.items():
    a=cm[ord(c)]; d=t-kern(a,u)
    if d: pairs[(a,u)]=(buildValue({'XAdvance':d}),None)
for c,t in after.items():
    b=cm[ord(c)]; d=t-kern(u,b)
    if d: pairs[(u,b)]=(buildValue({'XAdvance':d}),None)
gm=f.getReverseGlyphMap()
st=buildPairPosGlyphsSubtable(pairs, gm)
lk=buildLookup([st])
gp.LookupList.Lookup.append(lk); gp.LookupList.LookupCount=len(gp.LookupList.Lookup)
idx=len(gp.LookupList.Lookup)-1
for fr in gp.FeatureList.FeatureRecord:
    if fr.FeatureTag=='kern':
        fr.Feature.LookupListIndex.append(idx); fr.Feature.LookupCount=len(fr.Feature.LookupListIndex)
print('pairs',{k:v[0].XAdvance for k,v in pairs.items()})
f.save(out)
