$(document).ready(function() {
    var game = new Game();
    game.start();

    $('#power-up').click(function(event) {
        clearAll();
        game = new Game();
        game.start();
        powerUp();
        $('#power-up').text('Restart')
    });

    $('#bowl').click(function(event) {
        if (game.isGameEnded()) {
            notifier("GAME OVER")
        } else if (game.currentFrame()._turnsRemaining < 2) {
            secondRoll(power());
        } else {
            firstRoll(power());
        }
        insertScores();
        if (game._currentFrame > 10 && game.isBonusFrame()) {
            unhideBonusFrames();
        }
    });

    var notifier = function(type, fadeIn=500, fadeOut=2500) {
        $("#notification-text").text(type);
        $("#notification" ).fadeIn( 500, function() {
        });
        $( "#notification" ).fadeOut( 2500, function() {
        });
    }

    var perfectNotifier = function() {
        if (game.score() === 300) {
            $("#notification-text").html("PERFECT GAME");
            $("#notification" ).fadeIn( 500, function() {
            });
        }
    }

    var power = function() {
        var elem = document.getElementById("power");
        var height = elem.style.height;
        return (Math.floor(height.replace("%", "") / 10));
    }

    var firstRoll = function(power) {
        game.bowl(power);
        if(power === 10) {
            insertFrameScore();
            notifier("STRIKE");
        }
        perfectNotifier()
    };

    var secondRoll = function(power) {
        var firstScore = game.currentFrame().firstScore();
        var pinsLeft = (10 - firstScore);
        game.bowl(Math.floor((pinsLeft / 100) * (power * 10)));
        if (game._frames[(game._currentFrame - 2)].isSpare()) {
            notifier("SPARE");
        }
        insertFrameScore();
    };

    var insertScores = function() {
        for (var i = 1; i <= game._frames.length; i++) {
            var frame = "#frame-" + i;
            var currFrame = game._frames[i - 1];
            if (currFrame.isFrameStarted()) {
                if (currFrame.isStrike()) {
                    $(frame + "-roll-1").text("X");
                } else if (currFrame.isSpare()) {
                    $(frame + "-roll-1").text(currFrame.firstScore());
                    $(frame + "-roll-2").text("/");
                } else {
                    $(frame + "-roll-1").text(currFrame.firstScore());
                    $(frame + "-roll-2").text(currFrame.secondScore());
                }
            }
        }
    };

    var insertFrameScore = function() {
        var score = "#frame-" + (game._currentFrame - 1);
        $(score + "-score").text(game.score());
    }

    var unhideBonusFrames = function() {
        $("#bonus-scores").attr("class", "show-frame");
        $("#frame-11").attr("class", "show-frame");
        $("#frame-12").attr("class", "show-frame");
    }

    function powerUp() {
        var height = 1;
        var id = setInterval(frame, 10);
        function frame() {
            if (height >= 100) {
                clearInterval(id);
                powerDown();
            } else {
                height++;
                $("#power").css("height", height + "%");
            }
        }
    }

    function powerDown() {
        var height = 100;
        var id = setInterval(frame, 8);
        function frame() {
            if (game.isGameEnded()) {
                clearInterval(id);
                $("#power").css("height", "0%");
            } else if (height === 0) {
                clearInterval(id);
                powerUp();
            } else {
                height--;
                $("#power").css("height", height + "%");
            }
        }
    }

    var clearAll = function() {
        for (var i = 1; i <= 12; i++) {
            var frame = "#frame-" + i;
            $(frame + "-score").text("");
            $(frame + "-roll-1").text("");
            $(frame + "-roll-2").text("");
        }
    }

});
