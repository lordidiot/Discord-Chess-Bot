var Discordie = require("discordie");
var PImage = require("pureimage");
var fs = require("fs");

var client = new Discordie();

//white images
var wPawn = PImage.make(39,50);
var wRook = PImage.make(44,49);
var wBishop = PImage.make(54,54);
var wKnight = PImage.make(52,53);
var wQueen = PImage.make(62,58);
var wKing = PImage.make(54,56);

var bPawn = PImage.make(39,50);
var bRook = PImage.make(49,53);
var bBishop = PImage.make(56,55);
var bKnight = PImage.make(53,53);
var bQueen = PImage.make(60,57);
var bKing = PImage.make(57,57);


//black images
var wPawn1 = PImage.make(39,50);
var wRook1 = PImage.make(44,49);
var wBishop1 = PImage.make(54,54);
var wKnight1 = PImage.make(52,53);
var wQueen1 = PImage.make(62,58);
var wKing1 = PImage.make(54,56);

var bPawn1 = PImage.make(39,50);
var bRook1 = PImage.make(49,53);
var bBishop1 = PImage.make(56,55);
var bKnight1 = PImage.make(53,53);
var bQueen1 = PImage.make(60,57);
var bKing1 = PImage.make(57,57);

//board image
var Board = PImage.make(673,706);
var newGame;
var inGame = false;
var p1;
var p2;

//bot setup
client.connect({ token: "INSERT TOKEN HERE" });

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);

  //change pp
  //client.User.setAvatar(fs.readFileSync("denking.png"));

  //load images
  console.log("Loading game images ... ");
  loadImages();
  loadImages1();
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
  if (e.message.content == "PING")
    e.message.channel.sendMessage("PONG");
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
  if (e.message.content == "!chess start")
    {
        if(inGame == true)
        {
            e.message.channel.sendMessage("You cannot start a game as there is currently one going on.");
        }
        else if(inGame ==false)
        {
            p1 = e.message.author;
        }
    }
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
  if (e.message.content == "!chess join")
    {
        if(inGame == true)
        {
            e.message.channel.sendMessage("You cannot join a game that is currently going on.");
        }
        else if(inGame ==false)
        {
            p2 = e.message.author;
            newGame = new game(p1,p2);
            newGame.init();
            newGame.draw();
            setTimeout(function() { PImage.encodePNG(newGame.board, fs.createWriteStream("out.png"), function(err) {
                e.message.channel.uploadFile("out.png");
                e.message.channel.sendMessage("Game Prepared!");
            }); }, 500);
        }
    }
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
  if (e.message.content == "TEST")
    {
        PImage.encodePNG(newGame.board, fs.createWriteStream("out.png"), function(err) {
            console.log("Wrote to out.png");
        });
    }
});

client.Dispatcher.on("MESSAGE_CREATE", e => {
  if (e.message.content.length == 9)
    {
        var str = e.message.content;
        if(str.substring(0,4)=="move")
        {
            var startPos = 0;
            startPos += (parseInt(str.charAt(6))*10);
            startPos += columnAlphaToInt(str.charAt(5));

            var endPos = 0;
            endPos += (parseInt(str.charAt(8))*10);
            endPos += columnAlphaToInt(str.charAt(7));

            if(newGame.makeMove(e.message.author, startPos, endPos)==true)
            {
                setTimeout(function() { PImage.encodePNG(newGame.board, fs.createWriteStream("out.png"), function(err) {
                    e.message.channel.uploadFile("out.png");
                    if(newGame.winlose()==1)
                    {
                        e.message.channel.sendMessage(newGame.user1.mention+" wins! Well Played!");
                        inGame = false;
                    }
                    else if(newGame.winlose()==2)
                    {
                        e.message.channel.sendMessage(newGame.user2.mention+" wins! Good Job!");
                        inGame = false;
                    }
                    else
                    {
                        if(this.turn%2 == 1)
                        {
                            e.message.channel.sendMessage(newGame.user1.mention+" your move!");
                        }
                        else
                        {
                            e.message.channel.sendMessage(newGame.user2.mention+" your move!");
                        }
                    }

                }); }, 500);
            }

        }
    }
});

//game variables



//a = 0, blah blah

function game(_user1, _user2)
{
    this.user1 = _user1;
    this.user2 = _user2;
    this.turn = 1;
    this.blackPiece = [];
    this.whitePiece = [];
    this.board = PImage.make(673,706);

    this.init = function()
    {
        for(var i = 1; i <= 8; i++)
        {
            this.whitePiece.push(new piece("P", 2, i));
        }
        for(var i = 1; i <= 8; i++)
        {
            this.blackPiece.push(new piece("P", 7, i));
        }
        //rook
        this.whitePiece.push(new piece("R", 1, 1));
        this.whitePiece.push(new piece("R", 1, 8));
        this.blackPiece.push(new piece("R", 8, 1));
        this.blackPiece.push(new piece("R", 8, 8));

        //knight
        this.whitePiece.push(new piece("N", 1, 2));
        this.whitePiece.push(new piece("N", 1, 7));
        this.blackPiece.push(new piece("N", 8, 2));
        this.blackPiece.push(new piece("N", 8, 7));

        //Bishop
        this.whitePiece.push(new piece("B", 1, 3));
        this.whitePiece.push(new piece("B", 1, 6));
        this.blackPiece.push(new piece("B", 8, 3));
        this.blackPiece.push(new piece("B", 8, 6));

        //Queens
        this.whitePiece.push(new piece("Q", 1, 4));
        this.blackPiece.push(new piece("Q", 8, 4));

        //Kings
        this.whitePiece.push(new piece("K", 1, 5));
        this.blackPiece.push(new piece("K", 8, 5));

    }

    this.makeMove = function(user, startPos, endPos) //start(end) pos should be a 2 digit number, [row][column], e.g. 23, which would be 2c on the ches baord
    {
        if(this.turn%2==1 && this.user1.username==user.username)
        {
            //white
            var found = false;
            var i =0;
            while(!found)
            {
                if(this.whitePiece[i].row == Math.floor(startPos/10) && this.whitePiece[i].column == (startPos%10))
                {
                    found = true;
                }
                else
                {
                    if(i >= this.whitePiece.length-1)
                    {
                        console.log("Invalid Start Pos! Line 202. Current turn : White");
                        return false;
                    }
                    i++;
                }
            }
            if(this.move(this.whitePiece[i], endPos)==true)
            {
                this.turn++;
                console.log("Move made!");
                this.draw();
                return true;
            }
            else
            {
                console.log("Beep Boop. Invalid move.");
                return false;
            }
        }
        else if (this.turn%2==0 && this.user2.username==user.username)
        {
            //black
            var found = false;
            var i =0;
            while(!found)
            {
                if(this.blackPiece[i].row == Math.floor(startPos/10) && this.blackPiece[i].column == (startPos%10))
                {
                    found = true;
                }
                else
                {
                    if(i >= this.blackPiece.length-1)
                    {
                        console.log("Invalid Start Pos! Line 202. Current turn : Black");
                        return false;
                    }
                    i++;
                }
            }
            if(this.move(this.blackPiece[i], endPos)==true)
            {
                this.turn++;
                console.log("Move made!");
                this.draw();
                return true;
            }
            else
            {
                console.log("Beep Boop. Invalid move.");
                return false;
            }
        }
    }

    this.move = function(piece, endPos)
    {
        var endRow = Math.floor(endPos/10);
        var endColumn = endPos%10;
        var kill = false;
        if(this.turn%2==1)
        {
            //white
            if(piece.id=="P")
            {
                var difRow = Math.abs(endRow - piece.row);
                var difCol = Math.abs(endColumn - piece.column);
                console.log("White Pawn 234" + piece.id);
                if(  ((Math.floor(endPos/10)-1)==piece.row) && ((endPos%10)==piece.column) )
                {
                    //forward 1 move
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(this.whitePiece[i].row==(Math.floor(endPos/10))&& (this.whitePiece[i].column == endPos%10) )
                        {
                            console.log("242");return false;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(this.blackPiece[i].row==(Math.floor(endPos/10))&& (this.blackPiece[i].column == endPos%10) )
                        {
                            console.log("249");return false;
                        }
                    }
                    piece.row += 1; //move forward
                    piece.unmoved = false;
                    return true;
                }
                else if(((Math.floor(endPos/10)-2)==piece.row) && ((endPos%10)==piece.column) && piece.unmoved==true)
                {
                    //forward 2 move at start
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(this.whitePiece[i].row==(Math.floor(endPos/10))&& (this.whitePiece[i].column == endPos%10) )
                        {
                            console.log("263");return false;
                        }
                        else if(this.whitePiece[i].row==(Math.floor(endPos/10))-1&& (this.whitePiece[i].column == endPos%10))
                        {
                            console.log("267");return false;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(this.blackPiece[i].row==(Math.floor(endPos/10))&& (this.blackPiece[i].column == endPos%10) )
                        {
                            console.log("274");return false;
                        }
                        else if(this.blackPiece[i].row==(Math.floor(endPos/10))-1&& (this.blackPiece[i].column == endPos%10))
                        {
                            console.log("278");return false;
                        }
                    }
                    piece.row += 2; //move forward
                    piece.unmoved = false;
                    return true;
                }
                else if(difRow != 0 && difCol != 0 && difRow+difCol == 2)
                {
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                        {
                            this.blackPiece.splice(i,1);
                            piece.row = endRow;
                            piece.column = endColumn;
                            piece.unmoved = false;
                            return true;
                        }
                    }
                    return false;
                }
            }
            else if(piece.id == "R")
            {
                console.log("White Rook");
                if(piece.row == endRow && piece.column!= endColumn)
                {
                    //horizontal movement
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(piece.row==this.whitePiece[i].row)
                        {
                            if(piece.column<this.whitePiece[i].column && this.whitePiece[i].column < endColumn )
                            {
                                console.log("297");
                                return false;
                            }
                            else if(endColumn<this.whitePiece[i].column && this.whitePiece[i].column < piece.column)
                            {
                                console.log("302");
                                return false;
                            }
                        }
                        if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                        {
                            console.log("308");
                            return false;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(piece.row==this.blackPiece[i].row)
                        {
                            if(piece.column<this.blackPiece[i].column && this.blackPiece[i].column < endColumn )
                            {
                                console.log("318");
                                return false;
                            }
                            else if(endColumn<this.blackPiece[i].column && this.blackPiece[i].column < piece.column)
                            {
                                console.log("323");
                                return false;
                            }
                        }
                        if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                        {
                            kill = true;
                        }
                    }
                }
                else if(piece.column == endColumn&& piece.row != endRow)
                {
                    //vertical movement
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(piece.column==this.whitePiece[i].column)
                        {
                            if(piece.row<this.whitePiece[i].row && this.whitePiece[i].row < endRow )
                            {
                                console.log("342");
                                return false;
                            }
                            else if(endRow<this.whitePiece[i].row && this.whitePiece[i].row < piece.row)
                            {
                                console.log("347");
                                return false;
                            }
                        }
                        if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                        {
                            console.log("353");
                            return false;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(piece.column==this.blackPiece[i].column)
                        {
                            if(piece.row<this.blackPiece[i].row && this.blackPiece[i].row < endRow )
                            {
                                console.log("363");
                                return false;
                            }
                            else if(endRow<this.blackPiece[i].row && this.blackPiece[i].row < piece.row)
                            {
                                console.log("368");
                                return false;
                            }
                        }
                        if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                        {
                            kill = true;
                        }
                    }

                    if(kill == true)
                    {
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(this.blackPiece[i].row == endRow&& this.blackPiece[i].column == endColumn)
                            {
                                this.blackPiece.splice(i,1);
                                break;
                            }
                        }
                    }
                }
                piece.row = endRow;
                piece.column = endColumn;
                piece.unmoved = false;
                return true;
            }
            else if(piece.id == "B")
            {
                if(Math.abs(endRow - piece.row)==Math.abs(endColumn - piece.column))
                {
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        var difRow = this.whitePiece[i].row - piece.row;
                        var difCol = this.whitePiece[i].column - piece.column;
                        if(Math.abs(difRow)==Math.abs(difCol))
                        {
                            if(difRow == 0)
                            {

                            }
                            else if(Math.sign(difRow)==Math.sign(endRow - piece.row) && Math.sign(difCol)==Math.sign(endColumn - piece.column))
                            {
                                if(Math.abs(difRow) < Math.abs(endRow-piece.row))
                                {
                                    return false;
                                }
                            }
                        }
                        if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                        {
                            return false;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        var difRow = this.blackPiece[i].row - piece.row;
                        var difCol = this.blackPiece[i].column - piece.column;
                        if(Math.abs(difRow)==Math.abs(difCol))
                        {
                            if(difRow == 0)
                            {

                            }
                            else if(Math.sign(difRow)==Math.sign(endRow - piece.row) && Math.sign(difCol)==Math.sign(endColumn - piece.column))
                            {
                                if(Math.abs(difRow) < Math.abs(endRow-piece.row))
                                {
                                    return false;
                                }
                            }
                            if(this.blackPiece[i].row==endRow&&this.blackPiece[i].column==endColumn)
                            {
                                kill = true;
                            }
                        }
                    }
                    if(kill == true)
                    {
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(this.blackPiece[i].row == endRow&& this.blackPiece[i].column == endColumn)
                            {
                                this.blackPiece.splice(i,1);
                                break;
                            }
                        }
                    }
                    piece.row = endRow;
                    piece.column = endColumn;
                    piece.unmoved = false;
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else if(piece.id == "Q")
            {
                if(Math.abs(endRow - piece.row)==Math.abs(endColumn - piece.column))
                {
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        var difRow = this.whitePiece[i].row - piece.row;
                        var difCol = this.whitePiece[i].column - piece.column;
                        if(Math.abs(difRow)==Math.abs(difCol))
                        {
                            if(difRow == 0)
                            {

                            }
                            else if(Math.sign(difRow)==Math.sign(endRow - piece.row) && Math.sign(difCol)==Math.sign(endColumn - piece.column))
                            {
                                if(Math.abs(difRow) < Math.abs(endRow-piece.row))
                                {
                                    return false;
                                }
                            }
                        }
                        if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                        {
                            return false;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        var difRow = this.blackPiece[i].row - piece.row;
                        var difCol = this.blackPiece[i].column - piece.column;
                        if(Math.abs(difRow)==Math.abs(difCol))
                        {
                            if(difRow == 0)
                            {

                            }
                            else if(Math.sign(difRow)==Math.sign(endRow - piece.row) && Math.sign(difCol)==Math.sign(endColumn - piece.column))
                            {
                                if(Math.abs(difRow) < Math.abs(endRow-piece.row))
                                {
                                    return false;
                                }
                            }
                            if(this.blackPiece[i].row==endRow&&this.blackPiece[i].column==endColumn)
                            {
                                kill = true;
                            }
                        }
                    }
                    if(kill == true)
                    {
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(this.blackPiece[i].row == endRow&& this.blackPiece[i].column == endColumn)
                            {
                                this.blackPiece.splice(i,1);
                                break;
                            }
                        }
                    }
                    piece.row = endRow;
                    piece.column = endColumn;
                    piece.unmoved = false;
                    return true;
                }
                else
                {
                    if(piece.row == endRow && piece.column!= endColumn)
                    {
                        //horizontal movement
                        for(var i = 0; i < this.whitePiece.length; i++)
                        {
                            if(piece.row==this.whitePiece[i].row)
                            {
                                if(piece.column<this.whitePiece[i].column && this.whitePiece[i].column < endColumn )
                                {
                                    console.log("297");
                                    return false;
                                }
                                else if(endColumn<this.whitePiece[i].column && this.whitePiece[i].column < piece.column)
                                {
                                    console.log("302");
                                    return false;
                                }
                            }
                            if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                            {
                                console.log("308");
                                return false;
                            }
                        }
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(piece.row==this.blackPiece[i].row)
                            {
                                if(piece.column<this.blackPiece[i].column && this.blackPiece[i].column < endColumn )
                                {
                                    console.log("318");
                                    return false;
                                }
                                else if(endColumn<this.blackPiece[i].column && this.blackPiece[i].column < piece.column)
                                {
                                    console.log("323");
                                    return false;
                                }
                            }
                            if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                            {
                                kill = true;
                            }
                        }
                    }
                    else if(piece.column == endColumn&& piece.row != endRow)
                    {
                        //vertical movement
                        for(var i = 0; i < this.whitePiece.length; i++)
                        {
                            if(piece.column==this.whitePiece[i].column)
                            {
                                if(piece.row<this.whitePiece[i].row && this.whitePiece[i].row < endRow )
                                {
                                    console.log("342");
                                    return false;
                                }
                                else if(endRow<this.whitePiece[i].row && this.whitePiece[i].row < piece.row)
                                {
                                    console.log("347");
                                    return false;
                                }
                            }
                            if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                            {
                                console.log("353");
                                return false;
                            }
                        }
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(piece.column==this.blackPiece[i].column)
                            {
                                if(piece.row<this.blackPiece[i].row && this.blackPiece[i].row < endRow )
                                {
                                    console.log("363");
                                    return false;
                                }
                                else if(endRow<this.blackPiece[i].row && this.blackPiece[i].row < piece.row)
                                {
                                    console.log("368");
                                    return false;
                                }
                            }
                            if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                            {
                                kill = true;
                            }
                        }

                        if(kill == true)
                        {
                            for(var i = 0; i < this.blackPiece.length; i++)
                            {
                                if(this.blackPiece[i].row == endRow&& this.blackPiece[i].column == endColumn)
                                {
                                    this.blackPiece.splice(i,1);
                                    break;
                                }
                            }
                        }
                    }
                    piece.row = endRow;
                    piece.column = endColumn;
                    piece.unmoved = false;
                    return true;
                }
            }
            else if(piece.id ==  "N")
            {
                var difRow = Math.abs(endRow - piece.row);
                var difCol = Math.abs(endColumn - piece.column);
                if(difRow != 0 && difCol != 0 && difRow+difCol == 3)
                {
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(endRow==this.whitePiece[i].row && endColumn ==this.whitePiece[i].column)
                        {
                            return false;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(endRow==this.blackPiece[i].row && endColumn ==this.blackPiece[i].column)
                        {
                            kill = true;
                        }
                    }
                }
                else
                {
                    return false;
                }
                if(kill == true)
                {
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(endRow==this.blackPiece[i].row && endColumn ==this.blackPiece[i].column)
                        {
                            this.blackPiece.splice(i,1);
                            break;
                        }
                    }
                }
                piece.row = endRow;
                piece.column = endColumn;
                piece.unmoved = false;
                return true;
            }
            else if(piece.id == "K")
            {
                var difRow = Math.abs(endRow - piece.row);
                var difCol = Math.abs(endColumn - piece.column);
                var castle;

                for(var i = 0; i < this.whitePiece.length; i++)
                {
                    if(this.whitePiece[i].id == "R" && this.whitePiece[i].unmoved == true && piece.unmoved ==true)
                    {
                        castle = this.whitePiece[i];
                    }
                    else if(endRow==this.whitePiece[i].row && endColumn ==this.whitePiece[i].column)
                    {
                        return false;
                    }
                }
                for(var i = 0; i < this.blackPiece.length; i++)
                {
                    if(endRow==this.blackPiece[i].row && endColumn ==this.blackPiece[i].column)
                    {
                        kill = true;
                    }
                }

                if((difRow+difCol)==1)
                {

                }
                else if(difRow!=0 && difCol!=0 && (difRow+difCol)==2)
                {

                }
                else if(typeof castle !== 'undefined')
                {
                    console.log("CASTLING");
                    //castling
                    if(castle.column == 1)
                    {
                        for(var i = 0; i < this.whitePiece.length; i++)
                        {
                            if(this.whitePiece[i].row == piece.row && this.whitePiece[i].column<piece.column && this.whitePiece[i].column != castle.column)
                            {
                                return false;
                            }
                        }
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(this.blackPiece[i].row == piece.row && this.blackPiece[i].column<piece.column && this.blackPiece[i].column != castle.column)
                            {
                                return false;
                            }
                        }
                        castle.column += 3;
                        piece.column -= 2;
                        return true;
                    }
                    else if(castle.column == 8)
                    {
                        for(var i = 0; i < this.whitePiece.length; i++)
                        {
                            if(this.whitePiece[i].row == piece.row && this.whitePiece[i].column>piece.column && this.whitePiece[i].column != castle.column)
                            {
                                return false;
                            }
                        }
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(this.blackPiece[i].row == piece.row && this.blackPiece[i].column>piece.column && this.blackPiece[i].column != castle.column)
                            {
                                return false;
                            }
                        }
                        castle.column -= 2;
                        piece.column += 2;
                        return true;
                    }
                }
                else
                {
                    return false;
                }


                if(kill = true)
                {
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(endRow==this.blackPiece[i].row && endColumn ==this.blackPiece[i].column)
                        {
                            this.blackPiece.splice(i,1);
                            break;
                        }
                    }
                }
                piece.row = endRow;
                piece.column = endColumn;
                piece.unmoved = false;
                return true;
            }

        }
        else
        {
            //black
            if(piece.id=="P")
            {
                var difRow = Math.abs(endRow - piece.row);
                var difCol = Math.abs(endColumn - piece.column);
                console.log("Black Pawn 401" + piece.id);
                if(  ((Math.floor(endPos/10)+1)==piece.row) && ((endPos%10)==piece.column) )
                {
                    //forward 1 move
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(this.whitePiece[i].row==(Math.floor(endPos/10))&& (this.whitePiece[i].column == endPos%10) )
                        {
                            console.log("411");return false;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(this.blackPiece[i].row==(Math.floor(endPos/10))&& (this.blackPiece[i].column == endPos%10) )
                        {
                            console.log("418");return false;
                        }
                    }
                    piece.row -= 1; //move forward
                    piece.unmoved = false;
                    return true;
                }
                else if(((Math.floor(endPos/10)+2)==piece.row) && ((endPos%10)==piece.column) && piece.unmoved==true)
                {
                    //forward 2 move at start
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(this.whitePiece[i].row==(Math.floor(endPos/10))&& (this.whitePiece[i].column == endPos%10) )
                        {
                            console.log("432");return false;
                        }
                        else if(this.whitePiece[i].row==(Math.floor(endPos/10))+1&& (this.whitePiece[i].column == endPos%10))
                        {
                            console.log("436");return false;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(this.blackPiece[i].row==(Math.floor(endPos/10))&& (this.blackPiece[i].column == endPos%10) )
                        {
                            console.log("443");return false;
                        }
                        else if(this.blackPiece[i].row==(Math.floor(endPos/10))+1&& (this.blackPiece[i].column == endPos%10))
                        {
                            console.log("447");return false;
                        }
                    }
                    piece.row -= 2; //move forward
                    piece.unmoved = false;
                    return true;
                }
                else if(difRow != 0 && difCol != 0 && difRow+difCol == 2)
                {
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                        {
                            this.whitePiece.splice(i,1);
                            piece.row = endRow;
                            piece.column = endColumn;
                            piece.unmoved = false;
                            return true;
                        }
                    }
                    return false;
                }
            }
            else if(piece.id == "R")
            {
                console.log("Black Rook");
                if(piece.row == endRow && piece.column!= endColumn)
                {
                    //horizontal movement
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(piece.row==this.whitePiece[i].row)
                        {
                            if(piece.column<this.whitePiece[i].column && this.whitePiece[i].column < endColumn )
                            {
                                console.log("464");
                                return false;
                            }
                            else if(endColumn<this.whitePiece[i].column && this.whitePiece[i].column < piece.column)
                            {
                                console.log("469");
                                return false;
                            }
                        }
                        if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                        {
                            kill = true;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(piece.row==this.blackPiece[i].row)
                        {
                            if(piece.column<this.blackPiece[i].column && this.blackPiece[i].column < endColumn )
                            {
                                console.log("484");
                                return false;
                            }
                            else if(endColumn<this.blackPiece[i].column && this.blackPiece[i].column < piece.column)
                            {
                                console.log("489");
                                return false;
                            }
                        }
                        if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                        {
                            console.log("495");
                            return false;
                        }
                    }
                }
                else if(piece.column == endColumn&& piece.row != endRow)
                {
                    //vertical movement
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(piece.column==this.whitePiece[i].column)
                        {
                            if(piece.row<this.whitePiece[i].row && this.whitePiece[i].row < endRow )
                            {
                                console.log("509");
                                return false;
                            }
                            else if(endRow<this.whitePiece[i].row && this.whitePiece[i].row < piece.row)
                            {
                                console.log("514");
                                return false;
                            }
                        }
                        if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                        {
                            kill = true;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(piece.column==this.blackPiece[i].column)
                        {
                            if(piece.row<this.blackPiece[i].row && this.blackPiece[i].row < endRow )
                            {
                                console.log("529");
                                return false;
                            }
                            else if(endRow<this.blackPiece[i].row && this.blackPiece[i].row < piece.row)
                            {
                                console.log("534");
                                return false;
                            }
                        }
                        if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                        {
                            console.log("540");
                            return false;
                        }
                    }

                    if(kill == true)
                    {
                        for(var i = 0; i < this.whitePiece.length; i++)
                        {
                            if(this.whitePiece[i].row == endRow&& this.whitePiece[i].column == endColumn)
                            {
                                this.whitePiece.splice(i,1);
                                break;
                            }
                        }
                    }
                }
                piece.row = endRow;
                piece.column = endColumn;
                piece.unmoved = false;
                return true;
            }
            else if(piece.id == "B")
            {
                if(Math.abs(endRow - piece.row)==Math.abs(endColumn - piece.column))
                {
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        var difRow = this.whitePiece[i].row - piece.row;
                        var difCol = this.whitePiece[i].column - piece.column;
                        if(Math.abs(difRow)==Math.abs(difCol))
                        {
                            if(difRow == 0)
                            {

                            }
                            else if(Math.sign(difRow)==Math.sign(endRow - piece.row) && Math.sign(difCol)==Math.sign(endColumn - piece.column))
                            {
                                if(Math.abs(difRow) < Math.abs(endRow-piece.row))
                                {
                                    return false;
                                }
                            }
                            if(this.whitePiece[i].row==endRow&&this.whitePiece[i].column==endColumn)
                            {
                                kill = true;
                            }
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        var difRow = this.blackPiece[i].row - piece.row;
                        var difCol = this.blackPiece[i].column - piece.column;
                        if(Math.abs(difRow)==Math.abs(difCol))
                        {
                            if(difRow == 0)
                            {

                            }
                            else if(Math.sign(difRow)==Math.sign(endRow - piece.row) && Math.sign(difCol)==Math.sign(endColumn - piece.column))
                            {
                                if(Math.abs(difRow) < Math.abs(endRow-piece.row))
                                {
                                    return false;
                                }
                            }
                        }
                        if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                        {
                            return false;
                        }
                    }
                    if(kill == true)
                    {
                        for(var i = 0; i < this.whitePiece[i].length; i++)
                        {
                            if(this.whitePiece[i].row == endRow&& this.whitePiece[i].column == endColumn)
                            {
                                this.whitePiece.splice(i,1);
                                break;
                            }
                        }
                    }
                    piece.row = endRow;
                    piece.column = endColumn;
                    piece.unmoved = false;
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else if(piece.id == "Q")
            {
                if(Math.abs(endRow - piece.row)==Math.abs(endColumn - piece.column))
                {
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        var difRow = this.whitePiece[i].row - piece.row;
                        var difCol = this.whitePiece[i].column - piece.column;
                        if(Math.abs(difRow)==Math.abs(difCol))
                        {
                            if(difRow == 0)
                            {

                            }
                            else if(Math.sign(difRow)==Math.sign(endRow - piece.row) && Math.sign(difCol)==Math.sign(endColumn - piece.column))
                            {
                                if(Math.abs(difRow) < Math.abs(endRow-piece.row))
                                {
                                    return false;
                                }
                            }
                            if(this.whitePiece[i].row==endRow&&this.whitePiece[i].column==endColumn)
                            {
                                kill = true;
                            }
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        var difRow = this.blackPiece[i].row - piece.row;
                        var difCol = this.blackPiece[i].column - piece.column;
                        if(Math.abs(difRow)==Math.abs(difCol))
                        {
                            if(difRow == 0)
                            {

                            }
                            else if(Math.sign(difRow)==Math.sign(endRow - piece.row) && Math.sign(difCol)==Math.sign(endColumn - piece.column))
                            {
                                if(Math.abs(difRow) < Math.abs(endRow-piece.row))
                                {
                                    return false;
                                }
                            }
                        }
                        if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                        {
                            return false;
                        }
                    }
                    if(kill == true)
                    {
                        for(var i = 0; i < this.whitePiece[i].length; i++)
                        {
                            if(this.whitePiece[i].row == endRow&& this.whitePiece[i].column == endColumn)
                            {
                                this.whitePiece.splice(i,1);
                                break;
                            }
                        }
                    }
                    piece.row = endRow;
                    piece.column = endColumn;
                    piece.unmoved = false;
                    return true;
                }
                else
                {
                    if(piece.row == endRow && piece.column!= endColumn)
                    {
                        //horizontal movement
                        for(var i = 0; i < this.whitePiece.length; i++)
                        {
                            if(piece.row==this.whitePiece[i].row)
                            {
                                if(piece.column<this.whitePiece[i].column && this.whitePiece[i].column < endColumn )
                                {
                                    console.log("464");
                                    return false;
                                }
                                else if(endColumn<this.whitePiece[i].column && this.whitePiece[i].column < piece.column)
                                {
                                    console.log("469");
                                    return false;
                                }
                            }
                            if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                            {
                                kill = true;
                            }
                        }
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(piece.row==this.blackPiece[i].row)
                            {
                                if(piece.column<this.blackPiece[i].column && this.blackPiece[i].column < endColumn )
                                {
                                    console.log("484");
                                    return false;
                                }
                                else if(endColumn<this.blackPiece[i].column && this.blackPiece[i].column < piece.column)
                                {
                                    console.log("489");
                                    return false;
                                }
                            }
                            if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                            {
                                console.log("495");
                                return false;
                            }
                        }
                    }
                    else if(piece.column == endColumn&& piece.row != endRow)
                    {
                        //vertical movement
                        for(var i = 0; i < this.whitePiece.length; i++)
                        {
                            if(piece.column==this.whitePiece[i].column)
                            {
                                if(piece.row<this.whitePiece[i].row && this.whitePiece[i].row < endRow )
                                {
                                    console.log("509");
                                    return false;
                                }
                                else if(endRow<this.whitePiece[i].row && this.whitePiece[i].row < piece.row)
                                {
                                    console.log("514");
                                    return false;
                                }
                            }
                            if(this.whitePiece[i].row == endRow && this.whitePiece[i].column == endColumn)
                            {
                                kill = true;
                            }
                        }
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(piece.column==this.blackPiece[i].column)
                            {
                                if(piece.row<this.blackPiece[i].row && this.blackPiece[i].row < endRow )
                                {
                                    console.log("529");
                                    return false;
                                }
                                else if(endRow<this.blackPiece[i].row && this.blackPiece[i].row < piece.row)
                                {
                                    console.log("534");
                                    return false;
                                }
                            }
                            if(this.blackPiece[i].row == endRow && this.blackPiece[i].column == endColumn)
                            {
                                console.log("540");
                                return false;
                            }
                        }

                        if(kill == true)
                        {
                            for(var i = 0; i < this.whitePiece.length; i++)
                            {
                                if(this.whitePiece[i].row == endRow&& this.whitePiece[i].column == endColumn)
                                {
                                    this.whitePiece.splice(i,1);
                                    break;
                                }
                            }
                        }
                    }
                    piece.row = endRow;
                    piece.column = endColumn;
                    piece.unmoved = false;
                    return true;
                }
            }
            else if(piece.id ==  "N")
            {
                var difRow = Math.abs(endRow - piece.row);
                var difCol = Math.abs(endColumn - piece.column);
                if(difRow != 0 && difCol != 0 && difRow+difCol == 3)
                {
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(endRow==this.whitePiece[i].row && endColumn ==this.whitePiece[i].column)
                        {
                            kill = true;
                        }
                    }
                    for(var i = 0; i < this.blackPiece.length; i++)
                    {
                        if(endRow==this.blackPiece[i].row && endColumn ==this.blackPiece[i].column)
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    return false;
                }
                if(kill == true)
                {
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(endRow==this.whitePiece[i].row && endColumn ==this.whitePiece[i].column)
                        {
                            this.whitePiece.splice(i,1);
                            break;
                        }
                    }
                }
                piece.row = endRow;
                piece.column = endColumn;
                piece.unmoved = false;
                return true;
            }
            else if(piece.id == "K")
            {
                var difRow = Math.abs(endRow - piece.row);
                var difCol = Math.abs(endColumn - piece.column);

                for(var i = 0; i < this.whitePiece.length; i++)
                {
                    if(endRow==this.whitePiece[i].row && endColumn ==this.whitePiece[i].column)
                    {
                        kill = true;
                    }
                }
                for(var i = 0; i < this.blackPiece.length; i++)
                {
                    if(this.blackPiece[i].id == "R" && this.blackPiece[i].unmoved == true && piece.unmoved ==true)
                    {
                        castle = this.blackPiece[i];
                    }
                    else if(endRow==this.blackPiece[i].row && endColumn ==this.blackPiece[i].column)
                    {
                        return false;
                    }
                }

                if((difRow+difCol)==1)
                {

                }
                else if(difRow!=0 && difCol!=0 && (difRow+difCol)==2)
                {

                }
                else if(typeof castle !== 'undefined')
                {
                    //castling
                    if(castle.column == 1)
                    {
                        for(var i = 0; i < this.whitePiece.length; i++)
                        {
                            if(this.whitePiece[i].row == piece.row && this.whitePiece[i].column<piece.column && this.whitePiece[i].column != castle.column)
                            {
                                return false;
                            }
                        }
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(this.blackPiece[i].row == piece.row && this.blackPiece[i].column<piece.column && this.blackPiece[i].column != castle.column)
                            {
                                return false;
                            }
                        }
                        castle.column += 3;
                        piece.column -= 2;
                        return true;
                    }
                    else if(castle.column == 8)
                    {
                        for(var i = 0; i < this.whitePiece.length; i++)
                        {
                            if(this.whitePiece[i].row == piece.row && this.whitePiece[i].column>piece.column && this.whitePiece[i].column != castle.column)
                            {
                                return false;
                            }
                        }
                        for(var i = 0; i < this.blackPiece.length; i++)
                        {
                            if(this.blackPiece[i].row == piece.row && this.blackPiece[i].column>piece.column && this.blackPiece[i].column != castle.column)
                            {
                                return false;
                            }
                        }
                        castle.column -= 2;
                        piece.column += 2;
                        return true;
                    }
                }
                else
                {
                    return false;
                }

                if(kill = true)
                {
                    for(var i = 0; i < this.whitePiece.length; i++)
                    {
                        if(endRow==this.whitePiece[i].row && endColumn ==this.whitePiece[i].column)
                        {
                            this.whitePiece.splice(i,1);
                            break;
                        }
                    }
                }
                piece.row = endRow;
                piece.column = endColumn;
                piece.unmoved = false;
                return true;
            }
        }

    }

    this.winlose = function()
    {
        var found1 = false;
        var found2 = false;
        for(var i =0; i< this.whitePiece.length; i++)
        {
            if(this.whitePiece[i].id =="K")
            {
                found1 = true;
            }
        }
        for(var i =0; i< this.blackPiece.length; i++)
        {
            if(this.blackPiece[i].id =="K")
            {
                found2 = true;
            }
        }
        if(found1 != true)
        {
            return 2;
        }
        if(found2 != true)
        {
            return 1;
        }
    }

    this.draw = function()
    {
        var ctx = this.board.getContext("2d");
        ctx.drawImage(Board,0,0);
        for(var i = 0; i < this.whitePiece.length; i++)
        {
            var x,y;
            y = 58 + (this.whitePiece[i].row-1)*73.5;
            x = 559 - (this.whitePiece[i].column-1)*72;

            if(this.whitePiece[i].row%2 == this.whitePiece[i].column%2)
            {
                //blacksquare
                switch(this.whitePiece[i].id)
                {
                    case "P" :
                        ctx.drawImage(wPawn, x, y);
                        break;

                    case "R" :
                        ctx.drawImage(wRook, x, y);
                        break;

                    case "N" :
                        ctx.drawImage(wKnight, x, y);
                        break;

                    case "B" :
                        ctx.drawImage(wBishop, x, y);
                        break;

                    case "Q" :
                        ctx.drawImage(wQueen, x, y);
                        break;

                    case "K" :
                        ctx.drawImage(wKing, x, y);
                        break;
                }

            }
            else
            {
                //whitesquare
                switch(this.whitePiece[i].id)
                {
                    case "P" :
                        ctx.drawImage(wPawn1, x, y);
                        break;

                    case "R" :
                        ctx.drawImage(wRook1, x, y);
                        break;

                    case "N" :
                        ctx.drawImage(wKnight1, x, y);
                        break;

                    case "B" :
                        ctx.drawImage(wBishop1, x, y);
                        break;

                    case "Q" :
                        ctx.drawImage(wQueen1, x, y);
                        break;

                    case "K" :
                        ctx.drawImage(wKing1, x, y);
                        break;
                }

            }

        }

        for(var i = 0; i < this.blackPiece.length; i++)
        {
            var x,y;
            y = 58 + (this.blackPiece[i].row-1)*73.5;
            x = 559 - (this.blackPiece[i].column-1)*72;

            if(this.blackPiece[i].row%2 == this.blackPiece[i].column%2)
            {
                //blacksquare
                switch(this.blackPiece[i].id)
                {
                    case "P" :
                        ctx.drawImage(bPawn, x, y);
                        break;

                    case "R" :
                        ctx.drawImage(bRook, x, y);
                        break;

                    case "N" :
                        ctx.drawImage(bKnight, x, y);
                        break;

                    case "B" :
                        ctx.drawImage(bBishop, x, y);
                        break;

                    case "Q" :
                        ctx.drawImage(bQueen, x, y);
                        break;

                    case "K" :
                        ctx.drawImage(bKing, x, y);
                        break;
                }

            }
            else
            {
                //whitesquare
                switch(this.blackPiece[i].id)
                {
                    case "P" :
                        ctx.drawImage(bPawn1, x, y);
                        break;

                    case "R" :
                        ctx.drawImage(bRook1, x, y);
                        break;

                    case "N" :
                        ctx.drawImage(bKnight1, x, y);
                        break;

                    case "B" :
                        ctx.drawImage(bBishop1, x, y);
                        break;

                    case "Q" :
                        ctx.drawImage(bQueen1, x, y);
                        break;

                    case "K" :
                        ctx.drawImage(bKing1, x, y);
                        break;
                }

            }


        }
    }

}

function piece(_id, _row, _column)
{
    this.id = _id;
    this.row = _row;
    this.column = _column;
    this.unmoved = true;

}

function loadImages()
{
    PImage.decodePNG(fs.createReadStream("Board.png"),
        function(bitmap)
        {
            Board.getContext("2d").fillStyle = "#FFFFFF";
            Board.getContext("2d").fillRect(0,-1,673,707);
            Board.getContext("2d").drawImage(bitmap,0,0);
        }
    )


    //var atx = wPawn.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wPawn.png"),
        function(bitmap)
        {
            wPawn.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //var btx = wRook.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wRook.png"),
        function(bitmap)
        {
            wRook.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //var ctx = wBishop.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wBishop.png"),
        function(bitmap)
        {
            wBishop.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //var dtx = wKnight.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wKnight.png"),
        function(bitmap)
        {
            wKnight.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //var  = wQueen.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wQueen.png"),
        function(bitmap)
        {
            wQueen.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = wKing.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wKing.png"),
        function(bitmap)
        {
            wKing.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = bPawn.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bPawn.png"),
        function(bitmap)
        {
            bPawn.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = bRook.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bRook.png"),
        function(bitmap)
        {
            bRook.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = bBishop.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bBishop.png"),
        function(bitmap)
        {
            bBishop.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = bKnight.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bKnight.png"),
        function(bitmap)
        {
            bKnight.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //ctx = bQueen.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bQueen.png"),
        function(bitmap)
        {
            bQueen.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //ctx = bKing.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bKing.png"),
        function(bitmap)
        {
            bKing.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //ctx = Board.getContext("2d");


    return true;

}

function loadImages1()
{


    //var atx = wPawn.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wPawn.png"),
        function(bitmap)
        {
            wPawn1.getContext("2d").fillStyle = "#FFFFFF";
            wPawn1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            wPawn1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //var btx = wRook.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wRook.png"),
        function(bitmap)
        {
            wRook1.getContext("2d").fillStyle = "#FFFFFF";
            wRook1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            wRook1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //var ctx = wBishop.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wBishop.png"),
        function(bitmap)
        {
            wBishop1.getContext("2d").fillStyle = "#FFFFFF";
            wBishop1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            wBishop1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //var dtx = wKnight.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wKnight.png"),
        function(bitmap)
        {
            wKnight1.getContext("2d").fillStyle = "#FFFFFF";
            wKnight1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            wKnight1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //var  = wQueen.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wQueen.png"),
        function(bitmap)
        {
            wQueen1.getContext("2d").fillStyle = "#FFFFFF";
            wQueen1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            wQueen1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = wKing.getContext("2d");
    PImage.decodePNG(fs.createReadStream("wKing.png"),
        function(bitmap)
        {
            wKing1.getContext("2d").fillStyle = "#FFFFFF";
            wKing1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            wKing1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = bPawn.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bPawn.png"),
        function(bitmap)
        {
            bPawn1.getContext("2d").fillStyle = "#FFFFFF";
            bPawn1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            bPawn1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = bRook.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bRook.png"),
        function(bitmap)
        {
            bRook1.getContext("2d").fillStyle = "#FFFFFF";
            bRook1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            bRook1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = bBishop.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bBishop.png"),
        function(bitmap)
        {
            bBishop1.getContext("2d").fillStyle = "#FFFFFF";
            bBishop1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            bBishop1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

//    ctx = bKnight.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bKnight.png"),
        function(bitmap)
        {
            bKnight1.getContext("2d").fillStyle = "#FFFFFF";
            bKnight1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            bKnight1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //ctx = bQueen.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bQueen.png"),
        function(bitmap)
        {
            bQueen1.getContext("2d").fillStyle = "#FFFFFF";
            bQueen1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            bQueen1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //ctx = bKing.getContext("2d");
    PImage.decodePNG(fs.createReadStream("bKing.png"),
        function(bitmap)
        {
            bKing1.getContext("2d").fillStyle = "#FFFFFF";
            bKing1.getContext("2d").fillRect(0,-1,bitmap.width,bitmap.height+1);
            bKing1.getContext("2d").drawImage(bitmap,0,0);
        }
    )

    //ctx = Board.getContext("2d");


    return true;

}

function columnAlphaToInt(strin)
{
    str = strin.toLowerCase();
    switch(str)
    {
        case "a" :
            return 1;
            break;
        case "b" :
            return 2;
            break;
        case "c" :
            return 3;
            break;
        case "d" :
            return 4;
            break;
        case "e" :
            return 5;
            break;
        case "f" :
            return 6;
            break;
        case "g" :
            return 7;
            break;
        case "h" :
            return 8;
            break;
    }
}
