class TetrisScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TetrisScene' });
    this.BLOCK_SIZE = 30;
    this.GRID_WIDTH = 10;
    this.GRID_HEIGHT = 20;
    this.score = 0;
    this.blocks = [];
  }

  preload() {
    // Create colored blocks for different tetrominos
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff8800];
    colors.forEach((color, index) => {
      const graphics = this.add.graphics();
      graphics.fillStyle(color, 1);
      graphics.fillRect(0, 0, this.BLOCK_SIZE - 1, this.BLOCK_SIZE - 1);
      graphics.generateTexture(`block${index}`, this.BLOCK_SIZE, this.BLOCK_SIZE);
      graphics.destroy();
    });
  }

  create() {
    this.grid = Array(this.GRID_HEIGHT).fill().map(() => Array(this.GRID_WIDTH).fill(null));
    this.currentPiece = this.createNewPiece();
    this.nextPiece = this.createNewPiece();
    
    // Draw grid
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x333333);
    for (let i = 0; i <= this.GRID_WIDTH; i++) {
      graphics.moveTo(i * this.BLOCK_SIZE, 0);
      graphics.lineTo(i * this.BLOCK_SIZE, this.GRID_HEIGHT * this.BLOCK_SIZE);
    }
    for (let i = 0; i <= this.GRID_HEIGHT; i++) {
      graphics.moveTo(0, i * this.BLOCK_SIZE);
      graphics.lineTo(this.GRID_WIDTH * this.BLOCK_SIZE, i * this.BLOCK_SIZE);
    }
    graphics.strokePath();

    // Input handling
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Add key objects for better control
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Add key cooldown
    this.lastMoveTime = 0;
    this.moveDelay = 100; // Milliseconds between moves

    // Game loop with faster drop speed
    this.dropTimer = this.time.addEvent({
      delay: 800, // Reduced from 1000 to 800 for smoother gameplay
      callback: this.moveDown,
      callbackScope: this,
      loop: true
    });

    // Initial render
    this.renderPiece();
    this.renderNextPiece();
  }

  update() {
    const currentTime = this.time.now;
    
    if (currentTime - this.lastMoveTime > this.moveDelay) {
      if (this.leftKey.isDown) {
        this.movePiece(-1, 0);
        this.lastMoveTime = currentTime;
      } else if (this.rightKey.isDown) {
        this.movePiece(1, 0);
        this.lastMoveTime = currentTime;
      }
    }

    if (this.downKey.isDown) {
      this.moveDown();
    }

    // Add up key for rotation
    if (Phaser.Input.Keyboard.JustDown(this.upKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.rotatePiece();
    }
  }

  renderPiece() {
    // Clear previous blocks
    this.blocks.forEach(block => block.destroy());
    this.blocks = [];

    // Render current piece
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const block = this.add.image(
            (this.currentPiece.x + x) * this.BLOCK_SIZE + this.BLOCK_SIZE / 2,
            (this.currentPiece.y + y) * this.BLOCK_SIZE + this.BLOCK_SIZE / 2,
            `block${this.currentPiece.color}`
          );
          this.blocks.push(block);
        }
      });
    });

    // Render placed blocks
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== null) {
          const block = this.add.image(
            x * this.BLOCK_SIZE + this.BLOCK_SIZE / 2,
            y * this.BLOCK_SIZE + this.BLOCK_SIZE / 2,
            `block${value}`
          );
          this.blocks.push(block);
        }
      });
    });
  }

  renderNextPiece() {
    const nextBlockDiv = document.getElementById('next-block');
    if (!nextBlockDiv) return;

    // Clear previous next piece preview
    while (nextBlockDiv.firstChild) {
      nextBlockDiv.removeChild(nextBlockDiv.firstChild);
    }

    // Create canvas for next piece preview
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    const blockSize = 20;

    // Center the piece in the preview
    const offsetX = (canvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
    const offsetY = (canvas.height - this.nextPiece.shape.length * blockSize) / 2;

    // Draw next piece
    this.nextPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillStyle = this.getColorString(this.nextPiece.color);
          ctx.fillRect(
            offsetX + x * blockSize,
            offsetY + y * blockSize,
            blockSize - 1,
            blockSize - 1
          );
        }
      });
    });

    nextBlockDiv.appendChild(canvas);
  }

  getColorString(colorIndex) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800'];
    return colors[colorIndex];
  }

  movePiece(dx, dy) {
    const newX = this.currentPiece.x + dx;
    const newY = this.currentPiece.y + dy;

    if (this.isValidMove(newX, newY, this.currentPiece.shape)) {
      this.currentPiece.x = newX;
      this.currentPiece.y = newY;
      this.renderPiece();
      return true;
    }
    return false;
  }

  moveDown = () => {
    if (!this.movePiece(0, 1)) {
      this.placePiece();
      this.checkLines();
      this.currentPiece = this.nextPiece;
      this.nextPiece = this.createNewPiece();
      this.renderNextPiece();
      
      if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
        this.gameOver();
      }
    }
  }

  rotatePiece() {
    const rotated = this.currentPiece.shape[0].map((_, i) =>
      this.currentPiece.shape.map(row => row[i]).reverse()
    );

    if (this.isValidMove(this.currentPiece.x, this.currentPiece.y, rotated)) {
      this.currentPiece.shape = rotated;
      this.renderPiece();
    }
  }

  placePiece() {
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          this.grid[this.currentPiece.y + y][this.currentPiece.x + x] = this.currentPiece.color;
        }
      });
    });
    this.renderPiece();
  }

  checkLines() {
    for (let y = this.GRID_HEIGHT - 1; y >= 0; y--) {
      if (this.grid[y].every(cell => cell !== null)) {
        this.grid.splice(y, 1);
        this.grid.unshift(Array(this.GRID_WIDTH).fill(null));
        this.score += 100;
        document.getElementById('score').textContent = this.score;
      }
    }
    this.renderPiece();
  }

  gameOver() {
    this.dropTimer.remove();
    this.scene.pause();
    const text = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Game Over',
      { fontSize: '48px', fill: '#fff' }
    ).setOrigin(0.5);
    text.setDepth(1);
  }

  createNewPiece() {
    const pieces = [
      { shape: [[1, 1, 1, 1]], color: 0 },  // I
      { shape: [[1, 1], [1, 1]], color: 1 }, // O
      { shape: [[1, 1, 1], [0, 1, 0]], color: 2 }, // T
      { shape: [[1, 1, 1], [1, 0, 0]], color: 3 }, // L
      { shape: [[1, 1, 1], [0, 0, 1]], color: 4 }, // J
      { shape: [[1, 1, 0], [0, 1, 1]], color: 5 }, // S
      { shape: [[0, 1, 1], [1, 1, 0]], color: 6 }  // Z
    ];

    const piece = Phaser.Utils.Array.GetRandom(pieces);
    return {
      shape: piece.shape,
      color: piece.color,
      x: Math.floor(this.GRID_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0
    };
  }

  isValidMove(x, y, shape) {
    return shape.every((row, dy) =>
      row.every((value, dx) =>
        value === 0 ||
        (x + dx >= 0 &&
         x + dx < this.GRID_WIDTH &&
         y + dy >= 0 &&
         y + dy < this.GRID_HEIGHT &&
         !this.grid[y + dy][x + dx])
      )
    );
  }

  handleMobileControl = (action) => {
    const currentTime = this.time.now;
    
    switch (action) {
      case 'left':
        if (currentTime - this.lastMoveTime > this.moveDelay) {
          this.movePiece(-1, 0);
          this.lastMoveTime = currentTime;
        }
        break;
      case 'right':
        if (currentTime - this.lastMoveTime > this.moveDelay) {
          this.movePiece(1, 0);
          this.lastMoveTime = currentTime;
        }
        break;
      case 'down':
        this.moveDown();
        break;
      case 'rotate':
        this.rotatePiece();
        break;
    }
  }
}

export default TetrisScene; 