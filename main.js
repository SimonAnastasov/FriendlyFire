// ? Utility Function For Reference
// function addElement(parentId, elementTag, elementId, html) {
//     const parent = document.getElementById(parentId)
//     const newElement = document.createElement(elementTag)
//     newElement.setAttribute('id', elementId)
//     newElement.innerHTML = html
//     parent.appendChild(newElement)
// }

// Constants
const PLAYER_WIDTH = 90
const PLAYER_HEIGHT = 170
const PLAYER_SPEED = 3
const JUMP_HEIGHT = 300
const JUMP_SPEED = 7
const BULLET_WIDTH = 56
const BULLET_SPEED = 10
const ANIMATION_DELAY = 11
const LIVES = 3
const BULLETS = 6+1

const WALL_WIDTH = 200
const WALL_HEIGHT = 60

const OFFSET = 8

// Game Var
let game = {
    status: 'playing',
    player1: {
        status: 'alive',
        position: {
            x: document.getElementById('player1').getBoundingClientRect().x,
            y: document.getElementById('player1').getBoundingClientRect().y
        },
        direction: 'none',
        lastDirection: 'right',
        motion: [
            [
                '/media/stickmen/healthy-1.png',
                '/media/stickmen/healthy-2.png',
                '/media/stickmen/healthy-3.png'
            ],
            [
                '/media/stickmen/hit-1.png',
                '/media/stickmen/hit-2.png',
                '/media/stickmen/hit-3.png'
            ],
            [
                '/media/stickmen/hurt-1.png',
                '/media/stickmen/hurt-2.png',
                '/media/stickmen/hurt-3.png'
            ],
            [
                '/media/stickmen/dead.png',
                '/media/stickmen/dead.png',
                '/media/stickmen/dead.png'
            ]
        ],
        motionIndex: 0,
        bullets: [],
        isJumping: false,
        isFalling: false,
        startedJumpFrom: 0,
        lives: LIVES,
        bulletsCount: BULLETS
    },
    player2: {
        status: 'alive',
        position: {
            x: document.getElementById('player2').getBoundingClientRect().x,
            y: document.getElementById('player2').getBoundingClientRect().y
        },
        direction: 'none',
        lastDirection: 'left',
        motion: [
            [
                '/media/stickmen/healthy-1.png',
                '/media/stickmen/healthy-2.png',
                '/media/stickmen/healthy-3.png'
            ],
            [
                '/media/stickmen/hit-1.png',
                '/media/stickmen/hit-2.png',
                '/media/stickmen/hit-3.png'
            ],
            [
                '/media/stickmen/hurt-1.png',
                '/media/stickmen/hurt-2.png',
                '/media/stickmen/hurt-3.png'
            ],
            [
                '/media/stickmen/dead.png',
                '/media/stickmen/dead.png',
                '/media/stickmen/dead.png'
            ]
        ],
        motionIndex: 0,
        bullets: [],
        isJumping: false,
        isFalling: false,
        startedJumpFrom: 0,
        lives: LIVES,
        bulletsCount: BULLETS
    },
}

const body = document.querySelector('body')

let walls = [
    {x: 0, y: window.innerHeight-WALL_HEIGHT-100, width: WALL_WIDTH, height: WALL_HEIGHT},
    {x: window.innerWidth-WALL_WIDTH, y: window.innerHeight-WALL_HEIGHT-100, width: WALL_WIDTH, height: WALL_HEIGHT},
    {x: window.innerWidth/2-WALL_WIDTH/2, y: window.innerHeight/2, width: WALL_WIDTH, height: WALL_HEIGHT},
    {x: (window.innerWidth/2-WALL_WIDTH/2) / 2, y: (window.innerHeight/2+window.innerHeight-WALL_HEIGHT-100)/2, width: WALL_WIDTH, height: WALL_HEIGHT},
    {x: window.innerWidth/2-WALL_WIDTH/2 + ((window.innerWidth/2-WALL_WIDTH/2)/2), y: (window.innerHeight/2+window.innerHeight-WALL_HEIGHT-100)/2, width: WALL_WIDTH, height: WALL_HEIGHT},
]

function drawWalls() {
    walls.forEach(wall => {
        const newWall = document.createElement('img')
        newWall.setAttribute('src', './media/wall-2.png')
        newWall.classList.add('wall')
        newWall.style.position = 'absolute'
        newWall.style.left = wall.x + 'px'
        newWall.style.top = wall.y + 'px'
        
        body.appendChild(newWall)
    })
}
drawWalls()

let bulletID = 0

const player1 = document.getElementById('player1')
const player1Stickman = document.getElementById('player1Stickman')
const player1Head = document.getElementById('player1Head')

const player2 = document.getElementById('player2')
const player2Stickman = document.getElementById('player2Stickman')
const player2Head = document.getElementById('player2Head')

window.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase()
    const code = event.code

    // player1
    if (key === 'd') {
        game.player1.direction = 'right'
        game.player1.lastDirection = 'right'
    }
    else if (key === 'a') {
        game.player1.direction = 'left'
        game.player1.lastDirection = 'left'
    }
    else if (key === 'w' && !game.player1.isJumping) {
        game.player1.isJumping = true
        game.player1.startedJumpFrom = game.player1.position.y
    }
    else if (key === 'f' && game.player1.status === 'alive') {
        game.player1.bulletsCount--
        drawBullets('player1')
        
        if (game.player1.bulletsCount < 0) return
        if (game.player1.bulletsCount === 0) {
            setTimeout(() => {
                game.player1.bulletsCount = BULLETS
                reDrawBullets('player1')
            }, 2000)

            return
        }

        const bullet = {
            id: 'b'+bulletID++,
            direction: game.player1.lastDirection,
            x: (game.player1.lastDirection === 'right') ? game.player1.position.x + 80 : game.player1.position.x,
            y: game.player1.position.y + 50,
            flip: (game.player1.lastDirection === 'right') ? false : true
        }

        const newBullet = document.createElement('img')
        newBullet.setAttribute('id', bullet.id)
        newBullet.setAttribute('class', 'bullet')
        newBullet.setAttribute('src', './media/bullet.png')

        newBullet.style.left = bullet.x + 'px'
        newBullet.style.top = bullet.y + 'px'
        if (bullet.flip) newBullet.style.transform = 'scaleX(-1)'

        game.player1.bullets.push(bullet)

        body.appendChild(newBullet)
    }

    // player2
    if (code === 'ArrowRight') {
        game.player2.direction = 'right'
        game.player2.lastDirection = 'right'
    }
    else if (code === 'ArrowLeft') {
        game.player2.direction = 'left'
        game.player2.lastDirection = 'left'
    }
    else if (code === 'ArrowUp' && !game.player2.isJumping) {
        game.player2.isJumping = true
        game.player2.startedJumpFrom = game.player2.position.y
    }
    else if (key === 'p' && game.player2.status === 'alive') {
        game.player2.bulletsCount--
        drawBullets('player2')
        
        if (game.player2.bulletsCount < 0) return
        if (game.player2.bulletsCount === 0) {
            setTimeout(() => {
                game.player2.bulletsCount = BULLETS
                reDrawBullets('player2')
            }, 2000)

            return
        }

        const bullet = {
            id: 'b'+bulletID++,
            direction: game.player2.lastDirection,
            x: (game.player2.lastDirection === 'right') ? game.player2.position.x + 80 : game.player2.position.x,
            y: game.player2.position.y + 50,
            flip: (game.player2.lastDirection === 'right') ? false : true
        }

        const newBullet = document.createElement('img')
        newBullet.setAttribute('id', bullet.id)
        newBullet.setAttribute('class', 'bullet')
        newBullet.setAttribute('src', './media/bullet.png')

        newBullet.style.left = bullet.x + 'px'
        newBullet.style.top = bullet.y + 'px'
        if (bullet.flip) newBullet.style.transform = 'scaleX(-1)'

        game.player2.bullets.push(bullet)

        body.appendChild(newBullet)
    }
})

window.addEventListener('keyup', function(event) {
    const key = event.key.toLowerCase()
    const code = event.code

    if (key === 'd' || key === 'a') {
        game.player1.direction = 'none'
        game.player1.motionIndex = 0
        player1Stickman.setAttribute('src', game.player1.motion[LIVES-game.player1.lives][game.player1.motionIndex])
    }

    if (code === 'ArrowRight' || code === 'ArrowLeft') {
        game.player2.direction = 'none'
        game.player2.motionIndex = 0
        player2Stickman.setAttribute('src', game.player2.motion[LIVES-game.player2.lives][game.player2.motionIndex])
    }
})

function drawHearts(player) {
    if (player === 'player1') {
        for (let i = LIVES-1; i > game.player1.lives-1; i--) {
            document.getElementsByClassName('player1Heart')[i].style.opacity = '0'
        }
    }
    else {
        for (let i = 0; i < LIVES - (game.player2.lives); i++) {
            document.getElementsByClassName('player2Heart')[i].style.opacity = '0'
        }
    }
}

function drawBullets(player) {
    if (player === 'player1') {
        if (game.player1.bulletsCount < 0) return
        for (let i = BULLETS-2; i > game.player1.bulletsCount-2; i--) {
            if (document.getElementsByClassName('player1Bullet')[i] !== undefined) 
                document.getElementsByClassName('player1Bullet')[i].style.opacity = '0'
        }
    }
    else {
        if (game.player2.bulletsCount < 0) return
        for (let i = 0; i < BULLETS - (game.player2.bulletsCount); i++) {
            if (document.getElementsByClassName('player2Bullet')[i] !== undefined) 
                document.getElementsByClassName('player2Bullet')[i].style.opacity = '0'
        }
    }
}

function reDrawBullets(player) {
    if (player === 'player1') {
        for (let i = 0; i < BULLETS-1; i++) {
            document.getElementsByClassName('player1Bullet')[i].style.opacity = '1'
        }
    }
    else {
        for (let i = 0; i < BULLETS-1; i++) {
            document.getElementsByClassName('player2Bullet')[i].style.opacity = '1'
        }
    }
}

let animateCounter = 0
function animate() {
    requestAnimationFrame(animate)
    animateCounter++
    if (animateCounter >= 1000) animateCounter = 0

    if (game.player1.status === 'alive') {
        // For Bullet Player 1
        game.player1.bullets.forEach((bullet, index) => {
            const newX = (bullet.direction === 'right') ? bullet.x + BULLET_SPEED : bullet.x - BULLET_SPEED
            const bulletElement = document.getElementById(bullet.id)
    
            bulletElement.style.left = `${newX}px`
            bullet.x = newX
    
            if (bullet.x + BULLET_WIDTH < 0 || bullet.x > window.innerWidth) {
                game.player1.bullets.splice(index, 1)
    
                body.removeChild(bulletElement)
            }
    
            if (bullet.x > game.player2.position.x && bullet.x < game.player2.position.x+PLAYER_WIDTH) {
                if (bullet.y > game.player2.position.y && bullet.y < game.player2.position.y+PLAYER_HEIGHT) {
                    game.player1.bullets.splice(index, 1)
    
                    body.removeChild(bulletElement)
    
                    if (game.player2.lives > 1) {
                        game.player2.lives--
                        drawHearts('player2')
                        if (game.player2.direction === 'none') {
                            player2Stickman.setAttribute('src', game.player2.motion[LIVES-game.player2.lives][game.player2.motionIndex])
                        }
                    }
                    else {
                        if (game.player2.lives > 0) {
                            game.player2.lives--
                            drawHearts('player2')
                            if (game.player2.direction === 'none') {
                                player2Stickman.setAttribute('src', game.player2.motion[LIVES-game.player2.lives][game.player2.motionIndex])
                            }
                            // dead
                            game.player2.status = 'dead'
                            document.getElementById('win').innerHTML = 'Sims Won'
                            document.getElementById('win').style.display = 'block'
                        }
                        player2Head.style.display = 'none'
                        player2Stickman.style.width = '175px'
                        player2Stickman.style.height = '75px'
                    }
                }   
            }
        })
    
        // For Player 1
        // walking
        let newX = 0
        if (game.player1.direction === 'right') {
            if (game.player1.position.x + PLAYER_WIDTH < window.innerWidth) newX = game.player1.position.x + PLAYER_SPEED
            else newX = game.player1.position.x
    
            if (player1.classList.contains('flipX')) player1.classList.remove('flipX')
        }
        else if (game.player1.direction === 'left') {
            if (game.player1.position.x > 0) newX = game.player1.position.x - PLAYER_SPEED
            else newX = game.player1.position.x
    
            if (!player1.classList.contains('flipX')) player1.classList.add('flipX')
        }
    
        if (game.player1.direction === 'right' || game.player1.direction === 'left') {
            player1.style.left = newX + 'px'
            game.player1.position.x = newX
    
            if (game.player1.motionIndex === 1) game.player1.motionIndex = 2
            else game.player1.motionIndex = 1
            if (animateCounter % ANIMATION_DELAY === 0) player1Stickman.setAttribute('src', game.player1.motion[LIVES-game.player1.lives][game.player1.motionIndex])
    
            if (!game.player1.isJumping) {
                if (game.player1.position.y + PLAYER_HEIGHT <= window.innerHeight-OFFSET) {
                    let foundAtLeastOne = false
                    walls.forEach(wall => {
                        if (game.player1.position.x + PLAYER_WIDTH-30 >= wall.x && game.player1.position.x+30 <= wall.x + wall.width) {
                            foundAtLeastOne = true
                        }
                    })
                    
                    if (!foundAtLeastOne) {
                        game.player1.isJumping = true
                        game.player1.isFalling = true
                    }
                }
            }
        }
    
        // For Player 1
        // jumping
        let newY = 0
        if (game.player1.isJumping) {
            if (game.player1.position.y > game.player1.startedJumpFrom - JUMP_HEIGHT && !game.player1.isFalling) {
                newY = game.player1.position.y - JUMP_SPEED
                player1.style.top = newY + 'px'
    
                game.player1.position.y = newY
            }
            else {
                game.player1.isFalling = true
    
                newY = game.player1.position.y + JUMP_SPEED
                player1.style.top = newY + 'px'
    
                game.player1.position.y = newY
    
                walls.forEach(wall => {
                    if (game.player1.position.x + PLAYER_WIDTH-30 >= wall.x && game.player1.position.x+30 <= wall.x + wall.width) {
                        if (game.player1.isFalling) {
                            if (game.player1.position.y + PLAYER_HEIGHT >= wall.y && game.player1.position.y + PLAYER_HEIGHT < wall.y+OFFSET) {
                                game.player1.isJumping = false
                                game.player1.isFalling = false
                            }
                        }
                    }
                })
    
                if (game.player1.position.y >= window.innerHeight-PLAYER_HEIGHT-OFFSET) {
                    game.player1.isJumping = false
                    game.player1.isFalling = false
                }
            }
        }
    }

    if (game.player2.status === 'alive') {
        // For Bullet Player 2
        game.player2.bullets.forEach((bullet, index) => {
            const newX = (bullet.direction === 'right') ? bullet.x + BULLET_SPEED : bullet.x - BULLET_SPEED
            const bulletElement = document.getElementById(bullet.id)
    
            bulletElement.style.left = `${newX}px`
            bullet.x = newX
    
            if (bullet.x + BULLET_WIDTH < 0 || bullet.x > window.innerWidth) {
                game.player2.bullets.splice(index, 1)
    
                body.removeChild(bulletElement)
            }
    
            if (bullet.x > game.player1.position.x && bullet.x < game.player1.position.x+PLAYER_WIDTH) {
                if (bullet.y > game.player1.position.y && bullet.y < game.player1.position.y+PLAYER_HEIGHT) {
                    game.player2.bullets.splice(index, 1)
    
                    body.removeChild(bulletElement)
    
                    if (game.player1.lives > 1) {
                        game.player1.lives--
                        drawHearts('player1')
                        if (game.player1.direction === 'none') {
                            player1Stickman.setAttribute('src', game.player1.motion[LIVES-game.player1.lives][game.player1.motionIndex])
                        }
                    }
                    else {
                        if (game.player1.lives > 0) {
                            game.player1.lives--
                            drawHearts('player1')
                            if (game.player1.direction === 'none') {
                                player1Stickman.setAttribute('src', game.player1.motion[LIVES-game.player1.lives][game.player1.motionIndex])
                            }
                            // dead
                            game.player1.status = 'dead'
                            document.getElementById('win').innerHTML = 'Evs Won'
                            document.getElementById('win').style.display = 'block'
                        }
                        player1Head.style.display = 'none'
                        player1Stickman.style.width = '175px'
                        player1Stickman.style.height = '75px'
                    }
                }   
            }
        })
    
        // For Player 2
        // walking
        newX = 0
        if (game.player2.direction === 'right') {
            if (game.player2.position.x + PLAYER_WIDTH < window.innerWidth) newX = game.player2.position.x + PLAYER_SPEED
            else newX = game.player2.position.x
    
            if (player2.classList.contains('flipX')) player2.classList.remove('flipX')
        }
        else if (game.player2.direction === 'left') {
            if (game.player2.position.x > 0) newX = game.player2.position.x - PLAYER_SPEED
            else newX = game.player2.position.x
    
            if (!player2.classList.contains('flipX')) player2.classList.add('flipX')
        }
    
        if (game.player2.direction === 'right' || game.player2.direction === 'left') {
            player2.style.left = newX + 'px'
            game.player2.position.x = newX
    
            if (game.player2.motionIndex === 1) game.player2.motionIndex = 2
            else game.player2.motionIndex = 1
            if (animateCounter % ANIMATION_DELAY === 0) player2Stickman.setAttribute('src', game.player2.motion[LIVES-game.player2.lives][game.player2.motionIndex])
    
            if (!game.player2.isJumping) {
                if (game.player2.position.y + PLAYER_HEIGHT <= window.innerHeight-OFFSET) {
                    let foundAtLeastOne = false
                    walls.forEach(wall => {
                        if (game.player2.position.x + PLAYER_WIDTH-30 >= wall.x && game.player2.position.x+30 <= wall.x + wall.width) {
                            foundAtLeastOne = true
                        }
                    })
                    
                    if (!foundAtLeastOne) {
                        game.player2.isJumping = true
                        game.player2.isFalling = true
                    }
                }
            }
        }
    
        // For Player 2
        // jumping
        newY = 0
        if (game.player2.isJumping) {
            if (game.player2.position.y > game.player2.startedJumpFrom - JUMP_HEIGHT && !game.player2.isFalling) {
                newY = game.player2.position.y - JUMP_SPEED
                player2.style.top = newY + 'px'
    
                game.player2.position.y = newY
            }
            else {
                game.player2.isFalling = true
    
                newY = game.player2.position.y + JUMP_SPEED
                player2.style.top = newY + 'px'
    
                game.player2.position.y = newY
    
                walls.forEach(wall => {
                    if (game.player2.position.x + PLAYER_WIDTH-30 >= wall.x && game.player2.position.x+30 <= wall.x + wall.width) {
                        if (game.player2.isFalling) {
                            if (game.player2.position.y + PLAYER_HEIGHT >= wall.y && game.player2.position.y + PLAYER_HEIGHT < wall.y+OFFSET) {
                                game.player2.isJumping = false
                                game.player2.isFalling = false
                            }
                        }
                    }
                })
    
                if (game.player2.position.y >= window.innerHeight-PLAYER_HEIGHT-OFFSET) {
                    game.player2.isJumping = false
                    game.player2.isFalling = false
                }
            }
        } 
    }
}
animate()