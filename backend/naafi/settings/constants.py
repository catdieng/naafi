from typing import Dict, List, Literal, TypedDict, Union


# Define type for JSON settings with allowed keys
class JSONSetting(TypedDict, total=False):
    type: Literal["json"]
    allowed_keys: List[str]


# Union of possible setting definitions
SettingDef = Union[Literal["str", "int", "bool"], JSONSetting]

ALLOWED_SETTINGS: Dict[str, Dict[str, SettingDef]] = {
    "company": {
        "name": "str",
        "logo_url": "str",
        "address": {
            "type": "json",
            "allowed_keys": ["street", "city", "zip", "country"],
        },
        "phone": "str",
        "email": "str",
        "currency": "str",  # ISO 4217 codes like "EUR", "USD"
        "currency_symbol": "str",  # e.g. "€", "$"
        "timezone": "str",  # e.g. "Europe/Paris"
        "locale": "str",  # e.g. "fr_FR"
    },
    "billing": {
        "invoice_prefix": "str",
        "invoice_footer": "str",
        "invoice_notes": "str",
        "due_days": "int",
    },
}
