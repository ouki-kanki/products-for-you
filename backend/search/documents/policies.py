# when the size reaches 10gb delete indexs 90d old

ilm_policy = {
    'policy': {
        'phases': {
            'hot': {
                'actions': {
                    'rollover': {
                        'max_size': '10GB',
                        'max_age': '30d'
                    }
                }
            },
            'delete': {
                'min_age': '90d',
                'actions': {
                    'delete': {}
                }
            }
        }
    }
}
