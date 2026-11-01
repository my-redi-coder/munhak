# 모듈 지도 (자동 생성: tools/modmap.py)

index.html이 불러오는 순서대로예요. 뒤 파일은 앞 파일의 이름을 쓸 수 있어요.

| 파일 | 줄 | 내놓는 이름 |
|---|---|---|
| `js/core/util.js` | 11 | $, TAU, rnd, pick, clamp, damp, store, reduceMotion, bootFail |
| `js/core/config.js` | 117 | ADJ, UNI, UKEYS, SKIN, ZONES, ZKEYS, BACKS, LINES, TALK, ME, myName, TEAMS, HOME_SIDE, PLAYER_SCALE … |
| `songs/songs.js` | 19 | SONGS |
| `js/engine/renderer.js` | 35 | canvas, scene, camera, maxAniso, sun, canvasTex, mergeParts, MVC, Box, Cyl |
| `js/world/sky.js` | 13 | skyU, cloudTex, clouds |
| `js/world/field.js` | 35 | FN, fx, fz, FK, fenceR, fieldTex, field, outer |
| `js/world/props.js` | 35 | ledTex, ledMat |
| `js/world/landmarks.js` | 19 | TOWERS, HILL_CLEAR, hillBlocked, towerRY |
| `js/world/bigboard.js` | 87 | BB, bbEq, bbScreenTex, bbPanelTex, boardTick |
| `js/world/bbshow.js` | 85 | BBS, bbShow, bbShowOff, bbShowTick, bbDraw, bbWave, bbSea, bbHomerun, bbKKK, YW, bbYeonan |
| `js/world/kboard.js` | 19 | KB, kbTex, kbAdd, kbTick, kbClear |
| `js/world/stands.js` | 90 | SP, blocks, pos1B, buildBlock, SEATGEO, ZB, stageG |
| `js/world/greenzone.js` | 59 | GZ, gzY, gzP |
| `js/world/hogbanner.js` | 51 | hogTex, hogBanner |
| `js/world/bbq.js` | 64 | BBQ, bbqSmoke, bbqTick |
| `js/world/pz-kit.js` | 39 | PZ_SETS, pzFlat, pzArch, pzStar, pzSpark, pzScribble, pzRound, pzCover, pzMat, pzTexMat, pzNoiseTex |
| `js/world/pzone.js` | 146 | PZP, pzPanelDraw, pzDefaultArt, pzIcoGlove, pzIcoTicket, pzIcoBat, pzIcoCap, pzSetPhoto, pzSetLine, PZ_STAGE, PZB, pzTileTex, pzPoolTex, pzBackdropTex … |
| `js/world/hrboard.js` | 118 | HRB, HRB_TILE, hrDigitMat, HRB_SIDE, hrTile, hrSetTile, hrShield, hrMiles, hrBoard, hrShow, hrSetCount, hrTick |
| `js/world/crowd.js` | 40 | _m, crowd, crowdSet, crowdFlush |
| `js/world/daynight.js` | 108 | DN, DN_LOOK, DN_B, dnL, dnGlowTex, dnBuildLamps, dnBuildStars, dnGlow, dnApply, setDayNight, dnTick, dnOverride, dnEventDark |
| `js/entities/character.js` | 126 | GEO, ARMGEO, armGeo, M, shadowTex, shadowMat, faceTex, FACE, KFONT, drawBack, backTex, jerseyTex, jerseyShared, Char … |
| `js/entities/player.js` | 71 | BP, BPGEO, bpGeo, BPBACK, bpBackTex, Ballplayer, bpPose |
| `js/entities/bpface.js` | 61 | BPF, bpfXY, BPF_INK, bpfTex, bpfMat |
| `js/entities/mascot-kit.js` | 160 | MASCOT_UNI, mascotUni, MASCOT_FONT, MASCOT_REDUCED, MASCOT_SIG, mkLambert, mkShiny, mascotOnSphere, mascotOutline, mascotCapsule, mascotJerseyTex, mascotJersey, Mascot, mascotDamp … |
| `js/entities/mascot-redi.js` | 117 | REDI_DESIGN, makeRedi |
| `js/entities/mascot-barry.js` | 133 | BARRY_DESIGN, barryCrownShape, barryRay, barrySe, barryCrownGeo, barryFront, barryStick, makeBarry |
| `js/audio/audio.js` | 68 | AU, BPM, MEL, MELMAP, ROOTS, hz, auEnsure, applyVol, setSound, crowdSwell, noiseHit, drum, clap, hat … |
| `js/audio/songs.js` | 15 | SONG, songPick, songStart, songStop, songPlaying, songBeat |
| `js/audio/eventsfx.js` | 51 | HORN_VOL, evDuck, evReady, evSound, EVCLAP, evClapBuild, evClapStop |
| `js/audio/evbgm.js` | 29 | EVB, evBgmPlay, evBgmPrime, evBgmGo, evBgmStop, evBgmDuck |
| `js/game/state.js` | 32 | player, cam, PL, makePlayer, placeForSetup, clearNPCs, spawnNPCs, sitChar, standAtSeat, makeLeader |
| `js/game/mascots.js` | 51 | MASCOT_CFG, MASC, makeMascots, mascotRoll, mascotMeshes, mascotTap, mascotTick |
| `js/ui/feedback.js` | 36 | toastT, toast, labels, addLabel, _p, updateLabels, clearLabels, drawSoundIcon, fmt |
| `js/ui/setup.js` | 38 | buildSwatches, buildZoneList, syncBack, beaconTex, beacon, drawBeacon, overview, blockCenter, focusZone |
| `js/game/flow.js` | 44 | fadeTo, enterGame, goZone, leaveGame, startSetup |
| `js/game/actions.js` | 35 | ACT_LABEL, ACT_BTN, lineT, setActButtons, startAct, stopAct, setStatus |
| `js/ui/sheets.js` | 7 | lastFocus, openModal, closeModal |
| `js/game/crowdtalk.js` | 48 | CROWD, talkPool, actLine, crowdPick, crowdSay, crowdNear, crowdWave, crowdCalm |
| `js/game/npc.js` | 46 | npcReact, NPC_MSG, npcStart, npcStop, updateNPCs, _np |
| `js/game/fieldplay.js` | 75 | FP, PITCH, faceTo, fpAdd, setFieldMode, fpByRole, fpKeys, fpPose, POSE, PITCHKEYS, SWINGKEYS, fieldTick |
| `js/game/events.js` | 66 | EV, evCalm, evCalmCrowd, EV_SCENES, evCam, startEvent, evTick, evRelease, evFinish, skipEvent, evCrowdCheer, evShuffle, evCrowdShout, evCrowdCalm … |
| `js/ui/count.js` | 20 | EVCOUNT, evCountEl, evCount, evCountOff, evCount0 |
| `events/homer.js` | 120 | HR, hrRunPose, hrBallAt, hrTurn, hrBoardCam, hrFielders, hrPreField, hrLooseBat, hrLooseTick, hrRun, hrHighFive, hrOnDeck |
| `events/kkk.js` | 108 | KK, kkMirror, kkWalk, kkTurn, kkEase, kkLerp, kkFaceCam, kkBanzaiCam |
| `events/yeonan.js` | 163 | ynEase, ynLerp, YN, ynLoadLyrics, ynNightSetup, ynNight, ynBuildLights, ynLights, ynPeopleOn, ynPeopleOff, ynLyricEl, ynLyric, ynShot, ynCam |
| `js/ui/fieldmode.js` | 28 | matchSync, syncFieldBtns, pickFieldMode, pickDayTime |
| `js/ui/event-sheet.js` | 13 | buildEventList |
| `js/ui/food.js` | 176 | FD, FD_KEYS, FOOD, foodReset, foodOpen, fdTone, fdSnd, fdDish, fdBeer, fdBagSvg, fdTable, fdFx, fdBind, fdAddDish … |
| `js/ui/food-note.js` | 58 | NOTE, NOTE_PAGES, NOTE_DOODLE, NOTE_STAMP, noteSvg, noteFonts, noteLine, noteBuild, notePaint, noteGo, noteFocus, noteOpen, noteClose, noteBind |
| `js/ui/food-phone.js` | 127 | PHONE_CFG, PHONE, PH_DAYS, PH_ICON, phWall, phoneSvg, phDday, phBuild, phTime, phChime, phoneOpen, phoneClose, phoneBind |
| `js/ui/bullpen.js` | 21 | MG, openBullpen, closeBullpen |
| `js/game/input.js` | 55 | ray, endPtr, tapMark, onTap, showTap, leaveSeat, walkTo, goToSeat |
| `js/game/camera.js` | 34 | _t, camTarget, camDesired, snapCam, _dp, updateCam, resize, applyViewOffset |
| `js/game/sightsee.js` | 18 | SS, ssStart, ssStop, ssCam, ssDrag |
| `js/game/photozone.js` | 91 | PZ, _pzP, PZ_POSE, pzStart, pzStop, pzPose, pzHide, PZ_WIN, pzWinMeasure, pzFitD, pzCam, pzZoomTo, pzRayX, pzGrab … |
| `js/ui/photo.js` | 126 | PHOTO, POLA, photoStamp, photoDate, photoFonts, photoWin, polaPetal, polaTape, polaCompose, polaFlat, polaRender, takePhoto, polaCapDone |
| `js/ui/photozone-ui.js` | 61 | pzBtn, pzUIOpen, pzUIClose, pzUISync, pzHold |
| `js/ui/places.js` | 53 | PLACE_ICO, TOUR_GO, placeItem, placeGroup, placeMenuBuild, placeMenu |
| `js/ui/wall.js` | 58 | WALL, wallFonts, wallArt, wallOpen, wallClose |
| `js/game/movement.js` | 22 | updatePlayer |
| `js/world/petals.js` | 16 | petals, updatePetals |
| `js/app/loop.js` | 20 | T, frame |
| `js/app/boot.js` | 8 | _ro |
