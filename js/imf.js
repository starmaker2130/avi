var sessionManager = {
    page: 'home',
    description: null,
    option: null,
    content: {
        overlayVisible: false,
        selection: null,
        available: [],
        selection: null
    },
    connection: null,
    deviceType: null,
    view: null,
    mode: null,
    pageMatrix: null,
    selectionMatrix: [
        [{top: '1%', left: '1%'}, {top: '1%', left: '60%'}, {top: '1%', left: '65%'}, {top: '1%', left: '70%'}],
        [{top: '5%', left: '1%'}, {top: '5%', left: '60%'}, {top: '5%', left: '65%'}, {top: '5%', left: '70%'}],
        [{top: '10%', left: '1%'}, {top: '10%', left: '60%'}, {top: '10%', left: '65%'}, {top: '10%', left: '70%'}],
        [{top: '15%', left: '1%'}, {top: '15%', left: '60%'}, {top: '15%', left: '65%'}, {top: '15%', left: '70%'}],
    ]
};

function openOrderPage(){
    $('.page-content-container').animate({
        opacity: 0
    }, 1000, function(){
        $(this).hide();
    });

    setTimeout(function(){
        $('#order-content').show().animate({
            opacity: 1.0
        }, 1000, function(){
            $('.currently-unavailable-coming-soon').animate({
                opacity: 0.5
            }, 500);
        });
        sessionManager.page = 'order';
       // sessionManager.connection.emit('mainScreenPageChange', {target: 'order'});
    }, 1100);
}

function loadContentFromDatabase(){
    var contentItem;
    for(var key in contentDatabase){
        contentItem = contentDatabase[key];
        loadMediaItem(contentItem);
    }
}

function loadMediaItem(i){
    var item = i;
    var markup = `<div id='media-content-preview-${item.number}' class='media-content-preview-panel' style='background-image: ${item.bgi}; background-size: ${item.bgs}; background-position: ${item.bgp}; background-repeat: ${item.bgr}'>
                <div id='media-content-title-${item.number}' class='media-content-title'>${item.title}</div>
                <div id='media-rating-${item.number}' class='media-rating'>${item.rating}</div>
            </div>;
</div>`;
    
    sessionManager.content.available.push(item.title);

    $('#media-panel-container').append(markup);    
}

document.addEventListener('DOMContentLoaded', function(){
    
    sessionManager.connection = io.connect(location.host);    
    
    sessionManager.connection.emit('connectMainScreen', {status: true});
    
    sessionManager.connection.on('loadDeviceType', function(data){
        var type = data.type;
        sessionManager.deviceType = type;

        if(type=='desktop'){
            console.log('TODO: verify whether user is on snack shack main or using remote by waiting for remote tap trigger; if a remote tap is initiated then the view is in developer mode and the program shold record it as a desktop view of the remote for developers purposes');
        }
        else if(type=='mobile'){

            sessionManager.view = 'remote';
            sessionManager.mode = 'beta\dev\rel';

        }
    });
    
    sessionManager.connection.on('mainScreenPageChange', function(data){
        var matrix = data.matrix;
        var directionalX = data.position.x;
        var directionalY = data.position.y;
        sessionManager.pageMatrix = matrix;
        
        var setting = sessionManager.selectionMatrix[directionalY][directionalX];
        $('#currently-selected-item-overlay').css({
            top: setting.top,
            left: setting.left
        });
    });
    
    loadContentFromDatabase();

    setTimeout(function(){
        $('#main-content').show().animate({
            opacity: 1.0
        }, 500, function(){

            setTimeout(function(){
                $('.first-line-item').animate({
                    opacity: 0
                }, 500, function(){
                    $(this).hide();
                    var id = $(this).attr('id');
                    if(id=='first-line'){
                        $('#second-line').animate({
                            opacity: 1.0
                        }, 500);
                    }
                });
            }, 2000);
        });
    }, 1000);

    document.getElementById('logo').addEventListener('click', function(){
        $('.page-content-container').animate({
            opacity: 0
        }, 1000, function(){
            $(this).hide();
        });

        setTimeout(function(){
            $('#main-content').show().animate({
                opacity: 1.0
            }, 1000);
        }, 1100);

        sessionManager.page = 'home';
    });

    document.getElementById('order-option').addEventListener('click', function(){
        openOrderPage();
    });

    document.getElementById('order-page-shortcut').addEventListener('click', function(){
        openOrderPage();
    });

    document.getElementById('catalog-option').addEventListener('click', function(){
        $('.page-content-container').animate({
            opacity: 0
        }, 1000, function(){
            $(this).hide();
        });
        
        setTimeout(function(){    
            $('#catalog-content').css({
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '750px',
                height: '500px',
                margin: '-250px 0 0 -375px'
            }).show().animate({
                opacity: 1.0
            }, 1000);
        }, 1100);

        sessionManager.page = 'catalog';
    });

    document.getElementById('contact-option').addEventListener('click', function(){
        $('.page-content-container').animate({
            opacity: 0
        }, 1000, function(){
            $(this).hide();
        });

        setTimeout(function(){
            $('#contact-content').show().animate({
                opacity: 1.0
            }, 1000);
        }, 1100);

        sessionManager.page = 'contact';
    });

    document.getElementById('snacks-option').addEventListener('click', function(){
        if(sessionManager.page=='order'){
            console.log('on order');
            if(sessionManager.option==null){
                $('#snacks-overlay, #close-snacks-overlay-button').show().animate({
                    opacity: 1.0
                }, 1000);
                sessionManager.option = 'snacks';
            }
            else{
                console.log(`currently unavailable; option ${sessionManager.option} is in view`);
            }
        }
        else{
            console.log('not available');
        }
    });

    document.getElementById('rides-option').addEventListener('click', function(){
        if(sessionManager.page=='order'){
            console.log('on order');
            if(sessionManager.option==null){
                $('#rides-overlay, #close-rides-overlay-button').show().animate({
                    opacity: 1.0
                }, 1000);
                sessionManager.option = 'rides';
            }
            else{
                console.log(`currently unavailable; option ${sessionManager.option} is in view`);
            }
        }
        else{
            console.log('not available');
        }
    });

    document.getElementById('cash-icon').addEventListener('click', function(){
        $('.item-option-description').animate({
            opacity: 0
        }, 500, function(){
            $(this).hide();
        });

        setTimeout(function(){
            $('#order-page-shortcut').show().animate({
                opacity: 1.0
            }, 500);

            $('#cash-item-description').show().animate({
                opacity: 1.0
            }, 500, function(){
                sessionManager.description='cash';
            });
        }, 550);
    });

    document.getElementById('internet-icon').addEventListener('click', function(){
        $('.item-option-description').animate({
            opacity: 0
        }, 500, function(){
            $(this).hide();
        });

        setTimeout(function(){
            $('#order-page-shortcut').show().animate({
                opacity: 1.0
            }, 500);

            $('#internet-item-description').show().animate({
                opacity: 1.0
            }, 500, function(){
                sessionManager.description='internet';
            });
        }, 550);
    });

    document.getElementById('snacks-icon').addEventListener('click', function(){
        $('.item-option-description').animate({
            opacity: 0
        }, 500, function(){
            $(this).hide();
        });

        setTimeout(function(){
            $('#order-page-shortcut').show().animate({
                opacity: 1.0
            }, 500);

            $('#snacks-item-description').show().animate({
                opacity: 1.0
            }, 500, function(){
                sessionManager.description='snacks';
            });
        }, 550);
    });

    document.getElementById('rides-icon').addEventListener('click', function(){
        $('.item-option-description').animate({
            opacity: 0
        }, 500, function(){
            $(this).hide();
        });

        setTimeout(function(){
            $('#order-page-shortcut').show().animate({
                opacity: 1.0
            }, 500);

            $('#rides-item-description').show().animate({
                opacity: 1.0
            }, 1000, function(){
                sessionManager.description='rides';
            });
        }, 550);
    });

    $('.close-overlay-button').click(function(){
        if(sessionManager.option==null){
            console.log('no action available');
        }
        else{
            $('.order-overlay-container').animate({
                opacity: 0
            }, 500, function(){
                $(this).hide();
            });

            $(this).animate({
                opacity: 0
            }, 500, function(){
                $(this).hide();
            });

            sessionManager.option=null;
            console.log('hiding order option overlay.');
        }
    });
    
    $('#close-content-overlay-button').click(function(){
        if(sessionManager.content.overlayVisible==false){
            console.log('no action available');
        }
        else{
            $('#content-overlay-container').animate({
                opacity: 0,
                height: 0
            }, 500, function(){
                $(this).hide();
                sessionManager.content.overlayVisible = false;
            });
            
            sessionManager.content.selection = null;
        }
    });

    $('.media-content-preview-panel').click(function(){
        var sel = $(this).attr('id');
        sessionManager.content.selection = sel.substring(sel.lastIndexOf('-')+1);
        console.log(sessionManager.content.available[sessionManager.content.selection]);
        
        $('#content-overlay-container').show().animate({
            opacity: 1.0,
            height: '100%'
        }, 1000, function(){
            sessionManager.content.overlayVisible = true;
            console.log(sessionManager.content.selection);

        });
    });
});