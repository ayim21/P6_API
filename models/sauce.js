const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema ({
    userId: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true,
        match: [
            /(.|\s)*\S(.|\s)*/,
            'Field should not be empty'
        ]
    },
    manufacturer: { 
        type: String, 
        required: true,
        match: [
            /(.|\s)*\S(.|\s)*/,
            'Field should not be empty'
        ]
    },
    description: { 
        type: String, 
        required: true,
        match: [
            /(.|\s)*\S(.|\s)*/,
            'Field should not be empty'
        ]
    },
    mainPepper: { 
        type: String, 
        required: true,
        match: [
            /(.|\s)*\S(.|\s)*/,
            'Field should not be empty'
        ]
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    heat: { 
        type: Number, 
        required: true,
        min: 1,
        max: 10
    },
    likes: { 
        type: Number, 
        required: true 
    },
    dislikes: { 
        type: Number, 
        required: true 
    },
    usersLiked: { 
        type: [String],
        required: true 
    },
    usersDisliked: { 
        type: [String],
        required: true 
    }
});

module.exports = mongoose.model('Sauce', sauceSchema);