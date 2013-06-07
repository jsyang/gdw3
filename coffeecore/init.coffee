define [
  'core/util'
  'core/atom'
  'core/game'
  #'core/mobileFeatures'
], (_util, _atom, FishGame) ->
  
  startGame = ->
    # Loop the music.
    atom.playSound('music', true)
    
    window.game = new FishGame()
    window.game.run()
    
  
  loaded =
    gfx : false
    sfx : false
    
  isPreloadComplete = ->
    if loaded.gfx and loaded.sfx
      startGame()
      
      #if window.isMobile and window.orientation is 0
      #  window.onorientationchange()
        
      true
    else
      false
    
  atom.preloadImages({
    gameover        : 'gameover.png'
    swimandeat      : 'swimandeat.png'
    spawninggrounds : 'spawninggrounds.png'
  
    bolt24        : 'bolt24.png'
    dna           : 'dna.png'
  
    roe1          : 'roe/1.png'
    roe2          : 'roe/2.png'
    roe3          : 'roe/3.png'
  
    fatstart      : 'fat/start.png'
    fatmiddle     : 'fat/middle.png'
    fatend        : 'fat/end.png'
    
    fledgeling0   : 'fledgeling0.png'
    fledgeling1   : 'fledgeling1.png'
    
    fish00        : 'fish00.png'
    fish01        : 'fish01.png'
    fish10        : 'fish10.png'
    fish11        : 'fish11.png'
    fish20        : 'fish20.png'
    fish21        : 'fish21.png'
    
    bubble4       : 'bubble/4.png'
    bubble6       : 'bubble/6.png'
    bubble8       : 'bubble/8.png'
    bubble12      : 'bubble/12.png'
    bubble16      : 'bubble/16.png'
    bubble24      : 'bubble/24.png'
    bubble32      : 'bubble/32.png'
    
    hook160       : 'hook/160.png'
    hook161       : 'hook/161.png'
    hook24        : 'hook/24.png'
    hook32        : 'hook/32.png'
    
    rock1         : 'rock/1.png'
    rock2         : 'rock/2.png'
    rock3         : 'rock/3.png'
    rock4         : 'rock/4.png'
    rock5         : 'rock/5.png'
    rock6         : 'rock/6.png'
    rock7         : 'rock/7.png'
    rock8         : 'rock/8.png'
    
    plankton    : 'plankton.png'
    
    surface   : 'surface.png'
    seafloor1 : 'seafloor1.png'
    seafloor2 : 'seafloor2.png'
  }, ->
    loaded.gfx = true
    isPreloadComplete()
  )
  
  atom.preloadSounds({
    tick        : 'tick.mp3'
    die         : 'die.mp3'
    music       : 'music.mp3'
    ahahah      : 'ahahah1.mp3'
    
    plankton1   : 'plankton1.mp3'
    plankton2   : 'plankton2.mp3'
    plankton3   : 'plankton3.mp3'
    
    recruit     : 'recruit.mp3'
    roe         : 'roe.mp3'
  }, ->
    loaded.sfx = true
    isPreloadComplete()
  )
  
  return