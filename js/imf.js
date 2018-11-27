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
    level: 0,
    pageMatrix: null,
    selectionMatrix: null,
    calculateSelectionMatrix: function(){
        var currentlyOn = this.page;
        var currentMatrix = null;
        var logo = $('#logo-container').offset();
        var catalog = $('#catalog-option').offset();
        var order = $('#order-option').offset();
        var contact = $('#contact-option').offset();
        var footerOff = $('#footer').offset()
        var footerWidth = $('#footer').width();
        var xpos = footerOff.left + footerWidth/2 - 50;
        var ypos =  footerOff.top -  50;
        var level = this.level;
        
        switch(currentlyOn){
            case 'home':                
                currentMatrix = [
                    [
                        {top: logo.top, left: logo.left}, 
                        {top: order.top, left: order.left}, 
                        {top: catalog.top, left: catalog.left}, 
                        {top: contact.top, left: contact.left}
                    ],
                    [
                        {top: $('#get-cash-option').offset().top, left: $('#get-cash-option').offset().left},
                        {top: $('#get-internet-option').offset().top, left: $('#get-internet-option').offset().left},
                        {top: $('#get-snacks-option').offset().top, left: $('#get-snacks-option').offset().left},
                        {top: $('#get-rides-option').offset().top, left: $('#get-rides-option').offset().left}
                    ],
                    [
                        {top: ypos, left: xpos},
                        {top: ypos, left: xpos}, 
                        {top: ypos, left: xpos},
                        {top: ypos, left: xpos}
                    ]
                ];
                break;
            case 'order':
                var leftIndent = $('#snacks-option').offset().left;
                currentMatrix = [
                    [
                        {top: logo.top, left: logo.left},
                        {top: order.top, left: order.left},
                        {top: catalog.top, left: catalog.left},
                        {top: contact.top, left: contact.left}
                    ],
                    [
                        {top: $('#snacks-option').offset().top, left: leftIndent},
                        {top: $('#snacks-option').offset().top, left: leftIndent},
                        {top: $('#snacks-option').offset().top, left: leftIndent},
                        {top: $('#snacks-option').offset().top, left: leftIndent}
                    ],
                    [
                        {top: $('#connect-option').offset().top, left: leftIndent},
                        {top: $('#connect-option').offset().top, left: leftIndent},
                        {top: $('#connect-option').offset().top, left: leftIndent},
                        {top: $('#connect-option').offset().top, left: leftIndent}
                    ],
                    [
                        {top: $('#rides-option').offset().top, left: leftIndent},
                        {top: $('#rides-option').offset().top, left: leftIndent},
                        {top: $('#rides-option').offset().top, left: leftIndent},
                        {top: $('#rides-option').offset().top, left: leftIndent}
                    ],
                    [
                        {top: $('#withdraw-option').offset().top, left: leftIndent},
                        {top: $('#withdraw-option').offset().top, left: leftIndent},
                        {top: $('#withdraw-option').offset().top, left: leftIndent},
                        {top: $('#withdraw-option').offset().top, left: leftIndent}
                    ],
                    [
                        {top: ypos, left: xpos},
                        {top: ypos, left: xpos}, 
                        {top: ypos, left: xpos},
                        {top: ypos, left: xpos}
                    ]
                ];
                break;
            case 'catalog':
                if(level==0){
                    currentMatrix = [
                        [
                            {top: logo.top, left: logo.left}, 
                            {top: order.top, left: order.left}, 
                            {top: catalog.top, left: catalog.left}, 
                            {top: contact.top, left: contact.left}
                        ],
                        [
                            {top: $('#get-news-option').offset().top, left: $('#get-news-option').offset().left},
                            {top: $('#get-cinema-option').offset().top, left: $('#get-cinema-option').offset().left},
                            {top: $('#get-tube-option').offset().top, left: $('#get-tube-option').offset().left},
                            {top: $('#get-culture-option').offset().top, left: $('#get-culture-option').offset().left}
                        ],
                        [
                            {top: ypos, left: xpos},
                            {top: ypos, left: xpos}, 
                            {top: ypos, left: xpos},
                            {top: ypos, left: xpos}
                        ]
                    ];
                }
                else if(level==1){
                    var leftCol = $('#media-content-preview-0').offset().left;
                    var middleCol = $('#media-content-preview-1').offset().left;
                    var rightCol = $('#media-content-preview-2').offset().left;
                    
                    currentMatrix = [
                        [
                            {top: logo.top, left: logo.left},
                            {top: order.top, left: order.left},
                            {top: catalog.top, left: catalog.left},
                            {top: contact.top, left: contact.left}
                        ],
                        [
                            {top: $('#media-content-preview-0').offset().top, left: leftCol},
                            {top: $('#media-content-preview-1').offset().top, left: middleCol},
                            {top: $('#media-content-preview-2').offset().top, left: rightCol},
                            {top: $('#media-content-preview-2').offset().top, left: rightCol}
                        ],
                        [
                            {top: $('#media-content-preview-3').offset().top, left: leftCol},
                            {top: $('#media-content-preview-4').offset().top, left: middleCol},
                            {top: $('#media-content-preview-5').offset().top, left: rightCol},
                            {top: $('#media-content-preview-5').offset().top, left: rightCol}
                        ],
                        [
                            {top: $('#media-content-preview-6').offset().top, left: leftCol},
                            {top: $('#media-content-preview-7').offset().top, left: middleCol},
                            {top: $('#media-content-preview-8').offset().top, left: rightCol},
                            {top: $('#media-content-preview-8').offset().top, left: rightCol}
                        ],
                        [
                            {top: ypos, left: xpos},
                            {top: ypos, left: xpos}, 
                            {top: ypos, left: xpos},
                            {top: ypos, left: xpos}
                        ]
                    ];
                }
                
                break;
            case 'contact':
                currentMatrix = [
                    [
                        {top: logo.top, left: logo.left}, 
                        {top: order.top, left: order.left},
                        {top: catalog.top, left: catalog.left},
                        {top: contact.top, left: contact.left}
                    ],
                    [
                        {top: $('#ceo-profile-image').offset().top, left: $('#ceo-profile-image').offset().left}, 
                        {top: $('#sponsor-profile-image').offset().top, left: $('#sponsor-profile-image').offset().left},
                        {top: $('#ceo-profile-image').offset().top, left: $('#ceo-profile-image').offset().left}, 
                        {top: $('#sponsor-profile-image').offset().top, left: $('#sponsor-profile-image').offset().left}
                    ],
                    [
                        {top: $('#contact-link').offset().top, left: $('#contact-link').offset().left},
                        {top: $('#contact-link').offset().top, left: $('#contact-link').offset().left},
                        {top: $('#contact-link').offset().top, left: $('#contact-link').offset().left},
                        {top: $('#contact-link').offset().top, left: $('#contact-link').offset().left}
                    ]
                ];
                break;
            default:
                currentMatrix = [
                    [{top: logo.top, left: logo.left}, {top: order.top, left: order.left}, {top: catalog.top, left: catalog.left}, {top: contact.top, left: contact.left}],
                    [null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null],
                ];
                break;
        }
        this.selectionMatrix = currentMatrix;
    },
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
        sessionManager.connection.emit('selectPage', {target: 'order'});
    }, 1100);
}

function loadContentFromDatabase(submenu){
    var type = submenu;
    var contentItem;
    console.log(`retrieving ${type} from catalog...`);
    
    switch(type){
        case 'news':
            for(var key in contentDatabase.news){
                contentItem = contentDatabase.news[key];
                loadMediaItem(contentItem);
            }
            break;
        case 'cinema':
            for(var key in contentDatabase.cinema){
                contentItem = contentDatabase.cinema[key];
                loadMediaItem(contentItem);
            }
            break;
        case 'tube':
            for(var key in contentDatabase.tube){
                contentItem = contentDatabase.tube[key];
                loadMediaItem(contentItem);
            }
            break;
        case 'culture':
            for(var key in contentDatabase.culture){
                contentItem = contentDatabase.culture[key];
                loadMediaItem(contentItem);
            }
            break;
        default:
            break;
    }
}

function loadMediaItem(i){
    var item = i;
    var markup = `<div id='media-content-preview-${item.number}' class='media-content-preview-panel' style='background-image: ${item.bgi}; background-size: ${item.bgs}; background-position: ${item.bgp}; background-repeat: ${item.bgr}'>
                <div id='media-content-title-${item.number}' class='media-content-title'>${item.title}</div>
                <div id='media-rating-${item.number}' class='media-rating'>${item.rating}</div>
            </div>`;
    
    sessionManager.content.available.push(item.title);

    $('#media-panel-container').append(markup);    
}

function addMediaPanelEventListeners(){
    var logo = $('#logo-container').offset();
    var catalog = $('#catalog-option').offset();
    var order = $('#order-option').offset();
    var contact = $('#contact-option').offset();
    var footerOff = $('#footer').offset()
    var footerWidth = $('#footer').width();
    var xpos = footerOff.left + footerWidth/2 - 50;
    var ypos =  footerOff.top -  50;
    var leftCol = $('#media-content-preview-0').offset().left;
    var middleCol = $('#media-content-preview-1').offset().left;
    var rightCol = $('#media-content-preview-2').offset().left;

    sessionManager.selectionMatrix = [
        [
            {top: logo.top, left: logo.left},
            {top: order.top, left: order.left},
            {top: catalog.top, left: catalog.left},
            {top: contact.top, left: contact.left}
        ],
        [
            {top: $('#media-content-preview-0').offset().top, left: leftCol},
            {top: $('#media-content-preview-1').offset().top, left: middleCol},
            {top: $('#media-content-preview-2').offset().top, left: rightCol},
            {top: $('#media-content-preview-2').offset().top, left: rightCol}
        ],
        [
            {top: $('#media-content-preview-3').offset().top, left: leftCol},
            {top: $('#media-content-preview-4').offset().top, left: middleCol},
            {top: $('#media-content-preview-5').offset().top, left: rightCol},
            {top: $('#media-content-preview-5').offset().top, left: rightCol}
        ],
        [
            {top: $('#media-content-preview-6').offset().top, left: leftCol},
            {top: $('#media-content-preview-7').offset().top, left: middleCol},
            {top: $('#media-content-preview-8').offset().top, left: rightCol},
            {top: $('#media-content-preview-8').offset().top, left: rightCol}
        ],
        [
            {top: ypos, left: xpos},
            {top: ypos, left: xpos}, 
            {top: ypos, left: xpos},
            {top: ypos, left: xpos}
        ]
    ];
}

function resetCatalogMenu(){
    sessionManager.level=0;
    sessionManager.connection.emit('levelChange', {target: 0});
    $('#media-panel-container').empty().animate({
        opacity: 0
    }, 500, function(){
        $(this).hide();
        $('#catalog-menu-container').css({
            opacity: 1.0
        }).show();
    });
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
    
    sessionManager.connection.on('loadNewPageLevel', function(data){
        sessionManager.selectionMatrix = data.actionMatrix;
        sessionManager.level = data.level;
    });
    
    sessionManager.connection.on('mainScreenPageChange', function(data){
        var selecting = data.pause;
        var matrix = data.matrix;
        var directionalX = data.position.x;
        var directionalY = data.position.y;
        sessionManager.pageMatrix = matrix;
        
        if(selecting){
            setTimeout(function(){
                sessionManager.calculateSelectionMatrix();
            }, 1000);
        }
        else{
            sessionManager.calculateSelectionMatrix();
        }
        
        var setting = sessionManager.selectionMatrix[directionalY][directionalX];
        $('#currently-selected-item-overlay').css(setting);
    });
    
    sessionManager.connection.on('showRemoteSelectionOverlay', function(data){
        $('#currently-selected-item-overlay').show().animate({
            opacity: 1.0
        }, 1000);
    });
    
    sessionManager.connection.on('remoteActionRequest', function(data){
        var target = data.action;
        console.log(target);
        $(`${target}`).click();
    });
    
    sessionManager.connection.on('launchApplication', function(data){
        var target= data.status;
        console.log(target);
        
        switch(target){
            case 'showAndTell':
                console.log('launching show and tell...');
                window.open('./postAR','_blank');
                break;
            case 'cARd':
                window.open('./pamo','_blank');
                console.log('launching cARd...');
                break;
            case 'eV':
                window.open('./eV','_blank');
                console.log('opening eV avionics console...');
                break;
            case 'toggleAR':
                console.log('toggle AR mode');
                console.log(data.mode);
                break;
            default:
                break;
        }
        
    });
    
   // loadContentFromDatabase();

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
        if(sessionManager.level==1){
            resetCatalogMenu();
        }
        
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
        sessionManager.connection.emit('selectPage', {target: 'home'});
    });

    document.getElementById('order-option').addEventListener('click', function(){
        if(sessionManager.level==1){
            resetCatalogMenu();
        }
        openOrderPage();
    });

    document.getElementById('order-page-shortcut').addEventListener('click', function(){
        openOrderPage();
    });

    document.getElementById('catalog-option').addEventListener('click', function(){
        if(sessionManager.level==1){
            resetCatalogMenu();
        }
        
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
        sessionManager.connection.emit('selectPage', {target: 'catalog'});
    });

    document.getElementById('contact-option').addEventListener('click', function(){
        if(sessionManager.level==1){
            resetCatalogMenu();
        }
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
        sessionManager.connection.emit('selectPage', {target: 'contact'});
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
    
    document.getElementById('news-icon').addEventListener('click', function(){
        
        $('#catalog-menu-container').animate({
            opacity: 0
        }, 500, function(){
            $(this).hide();

            console.log('load news media');
            loadContentFromDatabase('news');
            console.log('complete.');
            
           //addMediaPanelEventListeners();
        });
        
        setTimeout(function(){
            $('#media-panel-container').show().animate({
                opacity: 1.0
            }, 500);
        }, 550);
    });

    document.getElementById('cinema-icon').addEventListener('click', function(){
        $('#catalog-menu-container').animate({
            opacity: 0
        }, 500, function(){
            $(this).hide();
            
            console.log('loading cinema media...');
            loadContentFromDatabase('cinema');
            console.log('complete.');
            
          //  addMediaPanelEventListeners();
        });

        setTimeout(function(){
            $('#media-panel-container').show().animate({
                opacity: 1.0
            }, 500);
        }, 550);
    });

    document.getElementById('tube-icon').addEventListener('click', function(){
        $('#catalog-menu-container').animate({
            opacity: 0
        }, 500, function(){
            $(this).hide();
            
            console.log('loading tube media...');
            loadContentFromDatabase('tube');
            console.log('complete.');
            
           // addMediaPanelEventListeners();
        });

        setTimeout(function(){
            $('#media-panel-container').show().animate({
                opacity: 1.0
            }, 500);
        }, 550);
    });

    document.getElementById('culture-icon').addEventListener('click', function(){
        $('#catalog-menu-container').animate({
            opacity: 0
        }, 500, function(){
            $(this).hide();
            
          //   addMediaPanelEventListeners();
            /*console.log('loading cinema media...');
            loadContentFromDatabase('tube');
            console.log('complete.');*/
        });

        setTimeout(function(){
            $('#media-panel-container').show().animate({
                opacity: 1.0
            }, 500);
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