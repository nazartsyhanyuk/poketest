$(document).ready(function(){
    var limit = 12,
        offset = 12;
    //create ajax request
    $.ajax({
                    type: 'GET',
                    beforeSend: function() {
                        $('#load_more').hide();
                        $('#spinner').show();
                    },
                    url: 'http://pokeapi.co/api/v1/pokemon/?limit='+limit,
                    dataType: 'jsonp',
                    cache: true,
                    success: create
    });

    //create a function, which will be generate a new pokemon elements with data from pokeapi.co server
    function create(data) {
        var  result = '',
             mydata = data;
        //for each object we create element in DOM
        for (var i=0; i<mydata.objects.length; i++) {
            var Pokemon_object = mydata.objects[i];
            result += "<div class=\'pokemon\' id=\'"+Pokemon_object.national_id+"\'>";
            result += "<div class=\'sprite\'>";
            result += "<img id=\'sprite\' src=\'http://pokeapi.co/media/img/"+Pokemon_object.national_id+".png\'>";
            result += "</div>";
            result += "<h2 class=\'name_item\'>";
            result += "<span id=\'name\'>"+Pokemon_object.name+"</span>";
            result += "</h2>";
            result += "<div class=\'types\'>";
            for (var j = 0; j < Pokemon_object.types.length; j++) {
                // Set the current ability we will add to the "types" span
                var abilityToAdd = (Pokemon_object.types[j].name);
                // Capitalise the first letter of the current ability
                abilityToAdd = abilityToAdd.charAt(0).toUpperCase() + abilityToAdd.slice(1, (abilityToAdd.length));
                // Append the current ability to the overall "types" variable
                result += '<li class="'+ abilityToAdd + '">'+ abilityToAdd + '</li>';
            }
            result += "</div>";
            result += "</div>";

        }   //add each generated element in parent container "pokemon_grid"
            $("#pokemon_grid").append(result);
            $('#load_more').show();
            $('#spinner').hide();
    }


    //create event - when we click on a single pokemon item in the grid next to it we see details of this pokemon
    $('#pokemon_grid').on('click', '.pokemon', function(evt){
        var preloader = $('#spinner');
            preloader.show();
        evt.preventDefault();
        var add_types='';
        var pokemon_id = $(this).attr('id').toString();
        //here we get an information about choosen pokemon
        $.getJSON("http://pokeapi.co/api/v1/pokemon/"+pokemon_id, function(data) {
            //and here we add this information into a div and fill table cells in it
            $('#full_image').attr('src','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokemon_id+'.png');
            $('#full_information_name').text(data.name+(' #'+('000'.slice(pokemon_id.length)+pokemon_id)));
            for (var i=0; i<data.types.length; i++) {
                add_types+= (data.types[i].name+' ');
            }
            $('#full_types').text(add_types);
            $('#full_attack').text(data.attack);
            $('#full_defense').text(data.defense);
            $('#full_hp').text(data.hp);
            $('#full_sp_attack').text(data.sp_atk);
            $('#full_sp_defense').text(data.sp_def);
            $('#full_speed').text(data.speed);
            $('#full_weight').text(data.weight);
            $('#full_total_moves').text(data.moves.length);        
            preloader.hide();
            $('.full_information').css('visibility','visible');
        });
            
    });
    //create event - when we click on "load more" button - we get a new 12 pokemons in pokemon grid
    $('#load_more').on('click', function(){
        var preloader = $('#spinner');
        $('#pokemon_grid').append(function(){
            $.ajax({
                type: 'GET',
                beforeSend: function() {
                    preloader.show();
                },
                url: 'http://pokeapi.co/api/v1/pokemon/?limit='+limit+'&offset='+offset,
                dataType: 'jsonp',
                cache: true,
                success: create,
                error: function() {
                    alert('Oops! Something wrong!');
                },
                complete: function() {
                    preloader.hide();
                }
        });
    });
        offset += limit;

    });
    //this is close button. when we click on it - block with detail information hidden
    $('#close_details').on('click', function(){
        $('.full_information').css('visibility', 'hidden');
    });




});
