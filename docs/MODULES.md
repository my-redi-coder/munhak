# 모듈 지도 (자동 생성: tools/modmap.py)

## 3D 야구장 — `stadium.html`

불러오는 순서대로예요. 뒤 파일은 앞 파일의 이름을 쓸 수 있어요.

| 파일 | 줄 | 내놓는 이름 |
|---|---|---|
| `js/core/util.js` | 11 | $, TAU, rnd, pick, clamp, damp, store, reduceMotion, bootFail |
| `js/core/config.js` | 126 | ADJ, UNI, UKEYS, SKIN, ZONES, ZKEYS, BACKS, LINES, TALK, ME, HAT_RATE, NPC_COUNT, FLOOR, myName … |
| `songs/songs.js` | 19 | SONGS |
| `js/engine/renderer.js` | 35 | canvas, scene, camera, maxAniso, sun, canvasTex, mergeParts, MVC, Box, Cyl |
| `js/world/sky.js` | 13 | skyU, cloudTex, clouds |
| `js/world/field.js` | 35 | FN, fx, fz, FK, fenceR, fieldTex, field, outer |
| `js/world/props.js` | 40 | LED_MSGS, ledDrawDefault, ledTex, ledMat |
| `js/world/landmarks.js` | 19 | TOWERS, HILL_CLEAR, hillBlocked, towerRY |
| `js/world/bigboard.js` | 87 | BB, bbEq, bbScreenTex, bbPanelTex, boardTick |
| `js/world/bbshow.js` | 85 | BBS, bbShow, bbShowOff, bbShowTick, bbDraw, bbWave, bbSea, bbHomerun, bbKKK, YW, bbYeonan |
| `js/world/kboard.js` | 24 | KB, kbTex, kbAdd, kbTick, kbClear |
| `js/world/stands.js` | 93 | SP, blocks, pos1B, buildBlock, SEATGEO, ZB, stageG |
| `js/world/outfield.js` | 88 | OF, ofFence, ofOut, ofLip |
| `js/world/greenzone.js` | 63 | GZ, gzY, gzD, gzP, gzWall, parts, nRail |
| `js/world/hogbanner.js` | 51 | hogTex, hogBanner |
| `js/world/bbq.js` | 65 | BBQ, bbqSmoke, bbqTick |
| `js/world/outskirts.js` | 86 | OSK |
| `js/world/curvestand.js` | 55 | CVS |
| `js/world/roofs.js` | 136 | ROOF |
| `js/world/pz-kit.js` | 39 | PZ_SETS, pzFlat, pzArch, pzStar, pzSpark, pzScribble, pzRound, pzCover, pzMat, pzTexMat, pzNoiseTex |
| `js/world/pzone.js` | 146 | PZP, pzPanelDraw, pzDefaultArt, pzIcoGlove, pzIcoTicket, pzIcoBat, pzIcoCap, pzSetPhoto, pzSetLine, PZ_STAGE, PZB, pzTileTex, pzPoolTex, pzBackdropTex … |
| `js/world/hrboard.js` | 118 | HRB, HRB_TILE, hrDigitMat, HRB_SIDE, hrTile, hrSetTile, hrShield, hrMiles, hrBoard, hrShow, hrSetCount, hrTick |
| `js/world/crowd.js` | 40 | _m, crowd, crowdSet, crowdFlush |
| `js/world/laundry.js` | 134 | LDY, LDY_FONT, LDY_GW, LDY_H, LDY_GEO, ldyJerseyTex, LDY_FAR, LDY_NEAR, LDYB, ldyFill, ldyCrowd, LDY_NUM, laundrySet, LDY_T … |
| `js/world/daynight.js` | 109 | DN, DN_LOOK, DN_B, dnL, dnGlowTex, dnBuildLamps, dnBuildStars, dnGlow, dnApply, setDayNight, dnTick, dnOverride, dnEventDark |
| `js/world/nightdim.js` | 50 | ND, ndK, ndApply |
| `js/entities/character.js` | 137 | GEO, ARMGEO, armGeo, M, shadowTex, shadowMat, faceTex, FACE, NAMEK, KFONT, drawBack, backTex, jerseyTex, jerseyShared … |
| `js/entities/uniform-kit.js` | 91 | UNI_L, UNI_LP, uniDrawL, UNI_FRONT, uniFrontMat, UNI_CAP, uniCapMat, uniCapLMat, uniHat, uniWhistle |
| `js/entities/player.js` | 71 | BP, BPGEO, bpGeo, BPBACK, bpBackTex, Ballplayer, bpPose |
| `js/entities/bpface.js` | 61 | BPF, bpfXY, BPF_INK, bpfTex, bpfMat |
| `js/entities/mascot-kit.js` | 207 | MASCOT_UNI, mascotUni, MASCOT_FONT, MASCOT_GROW, MASCOT_LEG, MASCOT_LEGGEO, mascotLegs, MASCOT_REDUCED, MASCOT_SIG, mkLambert, mkShiny, mascotOnSphere, mascotOutline, mascotCapsule … |
| `js/entities/mascot-redi.js` | 112 | REDI_DESIGN, makeRedi |
| `js/entities/mascot-barry.js` | 123 | BARRY_DESIGN, barryCrownShape, barryRay, barrySe, barryCrownGeo, barryFront, barryStick, makeBarry |
| `js/audio/audio.js` | 68 | AU, BPM, MEL, MELMAP, ROOTS, hz, auEnsure, applyVol, setSound, crowdSwell, noiseHit, drum, clap, hat … |
| `js/audio/songs.js` | 15 | SONG, songPick, songStart, songStop, songPlaying, songBeat |
| `js/audio/eventsfx.js` | 60 | HORN_VOL, CRACK, evDuck, evReady, evSound, EVCLAP, evClapBuild, evClapStop |
| `js/audio/evbgm.js` | 29 | EVB, evBgmPlay, evBgmPrime, evBgmGo, evBgmStop, evBgmDuck |
| `js/game/state.js` | 63 | player, cam, PL, makePlayer, placeForSetup, clearNPCs, NPC_SPREAD, npcPickSeats, spawnNPCs, npcUsskUni, sitChar, standAtSeat, makeLeader |
| `js/game/mascots.js` | 229 | MASCOT_CFG, MASC, mascotState, mascotTurnRoot, makeMascots, mascotRoll, mascotPlace, mascotMeshes, mascotTap, mascotPickPath, mascotKeepAway, mascotGroundH, mascotWalk, mascotReact … |
| `js/ui/feedback.js` | 36 | toastT, toast, labels, addLabel, _p, updateLabels, clearLabels, drawSoundIcon, fmt |
| `js/ui/setup.js` | 45 | buildSwatches, buildDeco, buildZoneList, syncBack, beaconTex, beacon, drawBeacon, overview, blockCenter, focusZone |
| `js/game/flow.js` | 42 | fadeTo, enterGame, goZone, leaveGame, LOBBY_URL, startSetup |
| `js/game/actions.js` | 35 | ACT_LABEL, ACT_BTN, lineT, setActButtons, startAct, stopAct, setStatus |
| `js/ui/sheets.js` | 7 | lastFocus, openModal, closeModal |
| `js/game/crowdtalk.js` | 48 | CROWD, talkPool, actLine, crowdPick, crowdSay, crowdNear, crowdWave, crowdCalm |
| `js/game/npc.js` | 46 | npcReact, NPC_MSG, npcStart, npcStop, updateNPCs, _np |
| `js/game/fieldplay.js` | 75 | FP, PITCH, faceTo, fpAdd, setFieldMode, fpByRole, fpKeys, fpPose, POSE, PITCHKEYS, SWINGKEYS, fieldTick |
| `js/game/events.js` | 66 | EV, evCalm, evCalmCrowd, EV_SCENES, evCam, startEvent, evTick, evRelease, evFinish, skipEvent, evCrowdCheer, evShuffle, evCrowdShout, evCrowdCalm … |
| `js/ui/count.js` | 20 | EVCOUNT, evCountEl, evCount, evCountOff, evCount0 |
| `events/homer.js` | 120 | HR, hrRunPose, hrBallAt, hrTurn, hrBoardCam, hrFielders, hrPreField, hrLooseBat, hrLooseTick, hrRun, hrHighFive, hrOnDeck |
| `events/kkk.js` | 108 | KK, kkMirror, kkWalk, kkTurn, kkEase, kkLerp, kkFaceCam, kkBanzaiCam |
| `events/yeonan.js` | 165 | ynEase, ynLerp, YN, ynLoadLyrics, ynNightSetup, ynNight, ynBuildLights, ynLights, ynPeopleOn, ynPeopleOff, YN_FIT, ynFit, ynLyricEl, ynLyric |
| `events/yeonan-cam.js` | 100 | YN_CAM, YC, ycPort, ycTan, ycAt, ycMix, ycBoard, ycBoardClose, ycShot, _ycv, ycMe, _ycp, ycSeat, ynCam … |
| `js/ui/fieldmode.js` | 28 | matchSync, syncFieldBtns, pickFieldMode, pickDayTime |
| `js/ui/event-sheet.js` | 13 | buildEventList |
| `js/ui/food.js` | 177 | FD, FD_KEYS, FOOD, foodReset, foodOpen, fdTone, fdSnd, fdDish, fdBeer, fdBagSvg, fdTable, fdFx, fdBind, fdAddDish … |
| `js/ui/food-note.js` | 59 | NOTE, NOTE_PAGES, NOTE_DOODLE, NOTE_STAMP, noteSvg, noteFonts, noteLine, noteBuild, notePaint, noteGo, noteFocus, noteOpen, noteClose, noteBind |
| `js/ui/food-phone.js` | 127 | PHONE_CFG, PHONE, PH_DAYS, PH_ICON, phWall, phoneSvg, phDday, phBuild, phTime, phChime, phoneOpen, phoneClose, phoneBind |
| `js/ui/food-ticket.js` | 46 | TKB, TKB_SRC, ticketBuild, ticketOpen, ticketClose, ticketGlint, ticketBind |
| `js/ui/bullpen.js` | 22 | MG, openBullpen, closeBullpen |
| `js/game/input.js` | 59 | ray, endPtr, tapMark, onTap, showTap, leaveSeat, walkTo, goToSeat |
| `js/game/camera.js` | 34 | _t, camTarget, camDesired, snapCam, _dp, updateCam, resize, applyViewOffset |
| `js/game/sightsee.js` | 73 | SS, ssRay, ssStart, ssStop, ssCam, ssDrag, ssPan, ssClamp, ssTap, ssFocus, ssBtn, ssHome, ssSync |
| `js/game/photozone.js` | 95 | PZ, _pzP, PZ_POSE, pzStart, pzStop, pzPose, pzHide, PZ_WIN, pzWinMeasure, pzFitD, pzCam, pzZoomTo, pzRayX, pzGrab … |
| `js/ui/photo.js` | 125 | PHOTO, POLA, photoStamp, photoDate, photoFonts, photoWin, polaPetal, polaTape, polaCompose, polaFlat, polaRender, takePhoto, polaCapDone |
| `js/ui/photozone-ui.js` | 67 | pzBtn, pzUIOpen, pzHintShow, pzUIClose, pzUISync, pzHold |
| `js/ui/places.js` | 53 | PLACE_ICO, TOUR_GO, placeItem, placeGroup, placeMenuBuild, placeMenu |
| `js/ui/wall-art.js` | 30 | wallArt |
| `js/ui/wall.js` | 31 | WALL, wallFonts, wallOpen, wallClose |
| `js/game/movement.js` | 22 | updatePlayer |
| `js/world/petals.js` | 16 | petals, updatePetals |
| `js/world/ribbon.js` | 53 | RIB, ribLyricUrl, ribSongNo, ribLoad, ribLineAt, ribbonFeed, ribDraw, ribbonTick |
| `js/app/loop.js` | 21 | T, frame |
| `js/app/boot.js` | 8 | _ro |

## 로비(첫 화면) — `index.html`

3D 야구장과 따로 도는 가벼운 2D 앞마당이에요. 자세한 건 docs/LOBBY.md.

| 파일 | 줄 | 내놓는 이름 |
|---|---|---|
| `js/lobby/config.js` | 31 | CONFIG |
| `js/lobby/kit.js` | 23 | L, NS, rng, arcY, hot, pine, bush, cherry |
| `js/lobby/scenery.js` | 78 | L.sky, L.hills, L.ground, L.plaza, L.lawn, L.petals |
| `js/lobby/stadium.js` | 118 | L.stadium, L.gate, L.queue, L.annex |
| `js/lobby/props.js` | 89 | L.pines, L.poles, L.booth, L.wall, L.monument, L.sign |
| `js/lobby/people.js` | 53 | PEOPLE, person, L.people |
| `js/lobby/scene.js` | 9 |  |
| `js/lobby/interact.js` | 153 | $, stage, reduced, state, hotEl, cfgOf, subsOf, clearSel, idleReset, showBubble, sparkle, toast, shake, wiggleStar … |

## 담벼락 페이지 — `wall.html`

로비에서 3D 없이 담벼락만 여는 페이지예요. js/ui/wall-art.js는 3D 야구장 안 담벼락과 같이 써요.

| 파일 | 줄 | 내놓는 이름 |
|---|---|---|
| `js/ui/wall-art.js` | 30 | wallArt |
| `js/lobby/wall-page.js` | 13 | WALL_BACK_URL, WALL, $, wallBack |
