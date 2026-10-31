# 모듈 지도 (자동 생성: tools/modmap.py)

index.html이 불러오는 순서대로예요. 뒤 파일은 앞 파일의 이름을 쓸 수 있어요.

| 파일 | 줄 | 내놓는 이름 |
|---|---|---|
| `js/core/util.js` | 11 | $, TAU, rnd, pick, clamp, damp, store, reduceMotion, bootFail |
| `js/core/config.js` | 58 | ADJ, UNI, UKEYS, SKIN, ZONES, ZKEYS, BACKS, LINES, ME, myName, TEAMS, HOME_SIDE, PLAYER_SCALE, POS … |
| `songs/songs.js` | 10 | SONGS |
| `js/engine/renderer.js` | 35 | canvas, scene, camera, maxAniso, sun, canvasTex, mergeParts, MVC, Box, Cyl |
| `js/world/sky.js` | 11 | cloudTex, clouds |
| `js/world/field.js` | 35 | FN, fx, fz, FK, fenceR, fieldTex, field, outer |
| `js/world/props.js` | 35 | ledTex, ledMat |
| `js/world/landmarks.js` | 10 |  |
| `js/world/bigboard.js` | 87 | BB, bbEq, bbScreenTex, bbPanelTex, boardTick |
| `js/world/bbshow.js` | 73 | BBS, bbShow, bbShowOff, bbShowTick, bbDraw, bbWave, bbSea, bbHomerun, bbKKK |
| `js/world/stands.js` | 90 | SP, blocks, pos1B, buildBlock, SEATGEO, ZB, stageG |
| `js/world/greenzone.js` | 59 | GZ, gzY, gzP |
| `js/world/hogbanner.js` | 51 | hogTex, hogBanner |
| `js/world/bbq.js` | 64 | BBQ, bbqSmoke, bbqTick |
| `js/world/crowd.js` | 40 | _m, crowd, crowdSet, crowdFlush |
| `js/entities/character.js` | 108 | GEO, ARMGEO, armGeo, M, shadowTex, shadowMat, faceTex, FACE, KFONT, drawBack, backTex, jerseyTex, jerseyShared, Char |
| `js/entities/player.js` | 69 | BP, BPGEO, bpGeo, BPBACK, bpBackTex, Ballplayer, bpPose |
| `js/audio/audio.js` | 68 | AU, BPM, MEL, MELMAP, ROOTS, hz, auEnsure, applyVol, setSound, crowdSwell, noiseHit, drum, clap, hat … |
| `js/audio/songs.js` | 15 | SONG, songPick, songStart, songStop, songPlaying, songBeat |
| `js/audio/eventsfx.js` | 43 | HORN_VOL, evDuck, evReady, evSound |
| `js/audio/evbgm.js` | 17 | EVB, evBgmPlay, evBgmStop, evBgmDuck |
| `js/game/state.js` | 32 | player, cam, PL, makePlayer, placeForSetup, clearNPCs, spawnNPCs, sitChar, standAtSeat, makeLeader |
| `js/ui/feedback.js` | 38 | toastT, toast, labels, addLabel, _p, updateLabels, clearLabels, drawSoundIcon, COUNTS, fmt, totalCount |
| `js/ui/setup.js` | 40 | buildSwatches, buildZoneList, syncBack, beaconTex, beacon, drawBeacon, overview, blockCenter, focusZone |
| `js/game/flow.js` | 43 | fadeTo, enterGame, goZone, leaveGame, startSetup |
| `js/game/actions.js` | 34 | ACT_LABEL, ACT_BTN, lineT, setActButtons, startAct, stopAct, setStatus |
| `js/ui/sheets.js` | 7 | lastFocus, openModal, closeModal |
| `js/game/npc.js` | 35 | npcReact, NPC_MSG, npcStart, npcStop, updateNPCs, _np |
| `js/game/fieldplay.js` | 75 | FP, PITCH, faceTo, fpAdd, setFieldMode, fpByRole, fpKeys, fpPose, POSE, PITCHKEYS, SWINGKEYS, fieldTick |
| `js/game/events.js` | 54 | EV, EV_SCENES, evCam, startEvent, evTick, evRelease, evFinish, skipEvent, evCrowdCheer, evCrowdShout, evCrowdCalm, evBoardCam, EVCAP, evCaption … |
| `events/homer.js` | 119 | HR, hrRunPose, hrBallAt, hrTurn, hrBoardCam, hrFielders, hrPreField, hrLooseBat, hrLooseTick, hrRun, hrHighFive, hrOnDeck |
| `events/kkk.js` | 82 | KK, kkMirror, kkWalk, kkTurn, kkEase, kkLerp |
| `js/ui/fieldmode.js` | 9 | syncFieldBtns, pickFieldMode |
| `js/ui/event-sheet.js` | 13 | buildEventList |
| `js/ui/food.js` | 172 | FD, FD_KEYS, FOOD, foodReset, foodOpen, fdTone, fdSnd, fdDish, fdBeer, fdBagSvg, fdTable, fdFx, fdBind, fdAddDish … |
| `js/game/input.js` | 53 | ray, endPtr, tapMark, onTap, showTap, leaveSeat, walkTo, goToSeat |
| `js/game/camera.js` | 32 | _t, camTarget, camDesired, snapCam, _dp, updateCam, resize, applyViewOffset |
| `js/game/sightsee.js` | 17 | SS, ssStart, ssStop, ssCam, ssDrag |
| `js/game/movement.js` | 21 | updatePlayer |
| `js/world/petals.js` | 16 | petals, updatePetals |
| `js/app/loop.js` | 18 | T, frame |
| `js/app/boot.js` | 7 | _ro |
